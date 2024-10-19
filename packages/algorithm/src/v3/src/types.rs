use wasm_bindgen::prelude::*;

use std::mem;

use once_cell::sync::Lazy;

use crate::{
    arrays::TwoDimensionalCells,
    schemas::{Op, Problem},
    utils::board_to_cells,
};

pub(crate) const UP: u8 = 0;
pub(crate) const DOWN: u8 = 1;
pub(crate) const LEFT: u8 = 2;
pub(crate) const RIGHT: u8 = 3;

#[derive(Clone, Copy, Debug)]
pub(crate) enum Direction {
    Up,
    Down,
    Left,
    Right,
}

impl Direction {
    pub(crate) fn from_u8(value: u8) -> Self {
        match value {
            UP => Self::Up,
            DOWN => Self::Down,
            LEFT => Self::Left,
            RIGHT => Self::Right,
            _ => unreachable!(),
        }
    }

    pub(crate) fn to_u8(&self) -> u8 {
        match self {
            Self::Up => UP,
            Self::Down => DOWN,
            Self::Left => LEFT,
            Self::Right => RIGHT,
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) struct Point {
    pub(crate) x: i32,
    pub(crate) y: i32,
}

#[derive(Clone, Debug)]
pub(crate) struct InternalPattern {
    pub(crate) p: u32,
    pub(crate) width: usize,
    pub(crate) height: usize,
    pub(crate) cells: TwoDimensionalCells,
}

fn generate_type_i(p: u32, size: usize) -> InternalPattern {
    let mut cells = TwoDimensionalCells::new(size, size);

    for i in 0..size {
        cells.set_row(i, vec![1; size].as_slice());
    }

    InternalPattern {
        p,
        width: size,
        height: size,
        cells,
    }
}

fn generate_type_ii(p: u32, size: usize) -> InternalPattern {
    let cells = TwoDimensionalCells::from_vec(
        size,
        size,
        (0..size * size)
            .flat_map(|i| {
                if i / size % 2 == 0 {
                    vec![1; size]
                } else {
                    vec![0; size]
                }
            })
            .collect(),
    );

    InternalPattern {
        p,
        width: size,
        height: size,
        cells,
    }
}

fn generate_type_iii(p: u32, size: usize) -> InternalPattern {
    let cells = TwoDimensionalCells::from_vec(
        size,
        size,
        (0..size * size)
            .flat_map(|_| [1, 0].repeat(size / 2))
            .collect(),
    );

    InternalPattern {
        p,
        width: size,
        height: size,
        cells,
    }
}

static FIXED_PATTERNS: Lazy<Vec<InternalPattern>> = Lazy::new(|| {
    let mut patterns = vec![InternalPattern {
        p: 0,
        width: 1,
        height: 1,
        cells: TwoDimensionalCells::from_vec(1, 1, vec![1]),
    }];

    let mut i = 1;
    let mut j = 2;

    while j <= 256 {
        patterns.push(generate_type_i(i, j));
        patterns.push(generate_type_ii(i + 1, j));
        patterns.push(generate_type_iii(i + 2, j));

        i += 3;
        j *= 2;
    }

    patterns
});

pub(crate) fn get_pattern(idx: usize, general: &[InternalPattern]) -> InternalPattern {
    if idx < FIXED_PATTERNS.len() {
        FIXED_PATTERNS[idx].clone()
    } else {
        general[idx - FIXED_PATTERNS.len()].clone()
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[wasm_bindgen]
pub struct ReverseOperationPatterns {
    pub has_reverse90: bool,
    pub has_reverse_up_down: bool,
    pub has_reverse_left_right: bool,
}

impl ReverseOperationPatterns {
    pub(crate) fn new() -> Self {
        Self {
            has_reverse90: false,
            has_reverse_up_down: false,
            has_reverse_left_right: false,
        }
    }
}

pub(crate) struct Context {
    pub(crate) board: TwoDimensionalCells,
    pub(crate) goal_board: TwoDimensionalCells,
    pub(crate) current_element_counts: Vec<[u32; 4]>,
    pub(crate) patterns: Vec<InternalPattern>,
    pub(crate) width: usize,
    pub(crate) height: usize,
    pub(crate) rv_op: ReverseOperationPatterns,

    // Answer
    pub(crate) n: u32,
    pub(crate) ops: Vec<Op>,
}

impl Context {
    pub(crate) fn new(problem: Problem) -> Self {
        let (board, goal_board) = board_to_cells(&problem.board);

        Self {
            board,
            goal_board,
            current_element_counts: vec![],
            patterns: problem
                .general
                .patterns
                .iter()
                .map(|p| InternalPattern {
                    p: p.p,
                    width: p.width as usize,
                    height: p.height as usize,
                    cells: TwoDimensionalCells::from_vec(
                        p.width as usize,
                        p.height as usize,
                        p.cells
                            .iter()
                            .flat_map(|s| {
                                s.chars()
                                    .map(|c| {
                                        c.to_digit(10).and_then(|n| u8::try_from(n).ok()).unwrap()
                                    })
                                    .collect::<Vec<_>>()
                            })
                            .collect(),
                    ),
                })
                .collect(),
            width: problem.board.width as usize,
            height: problem.board.height as usize,
            rv_op: ReverseOperationPatterns::new(),
            n: 0,
            ops: vec![],
        }
    }

    pub(crate) fn add_op(&mut self, op: Op) {
        let Op {
            p,
            mut y,
            mut x,
            mut s,
        } = op;

        let pattern = get_pattern(op.p as usize, &self.patterns);

        if self.rv_op.has_reverse90 {
            mem::swap(&mut x, &mut y);

            if self.rv_op.has_reverse_up_down {
                y = self.height as i32 - y - 1;
                y -= pattern.height as i32 - 1;

                if s == LEFT {
                    s = RIGHT;
                } else if s == RIGHT {
                    s = LEFT;
                }
            }

            if self.rv_op.has_reverse_left_right {
                x = self.width as i32 - x - 1;
                x -= pattern.width as i32 - 1;

                if s == UP {
                    s = DOWN;
                } else if s == DOWN {
                    s = UP;
                }
            }

            if s == UP {
                s = LEFT;
            } else if s == DOWN {
                s = RIGHT;
            } else if s == LEFT {
                s = UP;
            } else if s == RIGHT {
                s = DOWN;
            }
        } else {
            if self.rv_op.has_reverse_up_down {
                y = self.height as i32 - y - 1;
                y -= pattern.height as i32 - 1;

                if s == UP {
                    s = DOWN;
                } else if s == DOWN {
                    s = UP;
                }
            }

            if self.rv_op.has_reverse_left_right {
                x = self.width as i32 - x - 1;
                x -= pattern.width as i32 - 1;

                if s == LEFT {
                    s = RIGHT;
                } else if s == RIGHT {
                    s = LEFT;
                }
            }
        }

        self.n += 1;
        self.ops.push(Op { p, y, x, s });
    }
}
