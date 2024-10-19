use wasm_bindgen::prelude::*;

use std::cmp::max;

use evaluation::evaluate_row;
use katanuki::katanuki;
use schemas::{Answer, Problem};
use types::{Context, Direction, Point, ReverseOperationPatterns};
use utils::{
    cells_to_board, count_elements_column_wise, get_delta, multi_dereverse_cells,
    multi_reverse_cells,
};

mod arrays;
mod evaluation;
mod katanuki;
mod schemas;
mod types;
mod utils;

#[derive(Clone, Debug)]
#[wasm_bindgen(getter_with_clone)]
pub struct AnswerSet {
    pub answer: Answer,
    pub board: Vec<String>,
}

fn solve_func(c: &mut Context) -> AnswerSet {
    c.board = multi_reverse_cells(c.board.clone(), c.rv_op);
    c.goal_board = multi_reverse_cells(c.goal_board.clone(), c.rv_op);

    c.current_element_counts = count_elements_column_wise(&c.board);
    let goal_element_counts = count_elements_column_wise(&c.goal_board);

    let rv_ul = c.rv_op.has_reverse90;
    let rv_ud = c.rv_op.has_reverse_up_down;
    let rv_lr = c.rv_op.has_reverse_left_right;

    let mut delta;
    let mut cnt_unmoved = 0;

    for i in (0..c.height).rev() {
        let mut completed_rows = c.height - i - 1 - cnt_unmoved;

        delta = get_delta(
            &c.current_element_counts[c.height - 1 - cnt_unmoved],
            &goal_element_counts[i],
        );

        let mut unfilled: Vec<usize> = vec![];

        for j in 0..c.width {
            if delta == [0, 0, 0, 0] {
                break;
            }

            if cnt_unmoved > 0 {
                katanuki(
                    c,
                    22,
                    0,
                    c.height as i32 - cnt_unmoved as i32,
                    Direction::Down,
                );

                completed_rows += cnt_unmoved;
                cnt_unmoved = 0;
            }

            let looking_cell = c.board.get(c.height - 1, j).unwrap();

            if delta[looking_cell as usize] <= 0 {
                continue;
            }

            let mut is_filled = false;

            for k in (completed_rows..=c.height - 2).rev() {
                let looking_cell = c.board.get(k, j).unwrap();

                if delta[looking_cell as usize] > 0 {
                    let mut cnt = 0;
                    let mut value: [i32; 4] = [0, 0, 0, 256];

                    while k - (1 << cnt) + 1 >= completed_rows {
                        let x = j as i32;
                        let y = (k - (1 << cnt) + 1) as i32;

                        let mut p;
                        let mut pp = Point { x: 0, y: 0 };

                        let mut evaluation;

                        if cnt != 0 {
                            p = 3 * cnt - 1;
                            pp.x = if rv_ul && rv_ud { x - 1 } else { x };
                            pp.y = if !rv_ul && !rv_ud { y + 1 } else { y };

                            evaluation = evaluate_row(c, p, pp, goal_element_counts[i]);

                            if value[3] > evaluation {
                                value = [p as i32, pp.x, pp.y, evaluation];
                            }

                            p = 3 * cnt;
                            pp.x = if !rv_ul && rv_lr { x - 1 } else { x };
                            pp.y = if rv_ul && !rv_lr { y + 1 } else { y };

                            evaluation = evaluate_row(c, p, pp, goal_element_counts[i]);

                            if value[3] > evaluation {
                                value = [p as i32, pp.x, pp.y, evaluation];
                            }
                        } else {
                            p = 0;
                            pp = Point { x, y };

                            evaluation = evaluate_row(c, p, pp, goal_element_counts[i]);

                            if value[3] > evaluation {
                                value = [p as i32, pp.x, pp.y, evaluation];
                            }
                        }

                        cnt += 1;
                    }

                    katanuki(c, value[0] as u32, value[1], value[2], Direction::Up);

                    is_filled = true;

                    delta = get_delta(
                        &c.current_element_counts[c.height - 1],
                        &goal_element_counts[i],
                    );

                    break;
                }
            }

            if !is_filled {
                unfilled.push(j);
            }
        }

        // unfilled
        for j in unfilled {
            let mut is_filled = false;

            let looking_cell = c.board.get(c.height - 1, j).unwrap();

            if delta[looking_cell as usize] <= 0 {
                continue;
            }

            for k in 1..=(max(j, c.width - j - 1)) {
                // right side
                let mut x = j + k;

                if x < c.width {
                    for m in (completed_rows..=(c.height - 2)).rev() {
                        let looking_cell = c.board.get(m, x).unwrap();

                        if delta[looking_cell as usize] < 0 {
                            let mut y = m;
                            let mut ln = k;
                            let mut irregular = false;

                            if m % 2 == (c.height - 1) % 2 {
                                // Move lookingCell to the place which is confused and move the deepest cell to the place which is not confused
                                katanuki(
                                    c,
                                    if rv_ul { 2 } else { 3 },
                                    if (!rv_ul && !rv_lr) || (rv_ul && !rv_ud) {
                                        x as i32
                                    } else {
                                        x as i32 - 1
                                    },
                                    y as i32,
                                    Direction::Up,
                                );

                                irregular = true;
                                y = c.height - 2;
                            }

                            let mut cnt = 0;

                            while ln > 0 {
                                if ln % 2 == 1 {
                                    // border nukigata (else: 1 * 1)
                                    katanuki(
                                        c,
                                        if cnt == 0 {
                                            0
                                        } else if rv_ul {
                                            3 * cnt
                                        } else {
                                            3 * cnt - 1
                                        },
                                        (x - (1 << cnt)) as i32,
                                        if (!rv_ud && !rv_ul) || (!rv_lr && rv_ul) || cnt == 0 {
                                            y as i32
                                        } else {
                                            y as i32 - 1
                                        },
                                        Direction::Left,
                                    );

                                    x -= 1 << cnt;
                                }

                                ln >>= 1;
                                cnt += 1;
                            }

                            katanuki(c, 0, x as i32, y as i32, Direction::Up);

                            if irregular {
                                katanuki(c, 0, (j + k) as i32, c.height as i32 - 3, Direction::Up);
                            }

                            delta = get_delta(
                                &c.current_element_counts[c.height - 1],
                                &goal_element_counts[i],
                            );

                            is_filled = true;

                            break;
                        }
                    }
                }

                if is_filled {
                    break;
                }

                // left side
                let mut x = j as i32 - k as i32;

                if x >= 0 {
                    for m in (completed_rows..=(c.height - 2)).rev() {
                        let looking_cell = c.board.get(m, x as usize).unwrap();

                        if delta[looking_cell as usize] < 0 {
                            let mut y = m;
                            let mut ln = k;
                            let mut irregular = false;

                            if m % 2 == (c.height - 1) % 2 {
                                // Move lookingCell to the place which is confused and move the deepest cell to the place which is not confused
                                katanuki(
                                    c,
                                    if rv_ul { 2 } else { 3 },
                                    if (!rv_ul && !rv_lr) || (rv_ul && !rv_ud) {
                                        x
                                    } else {
                                        x - 1
                                    },
                                    y as i32,
                                    Direction::Up,
                                );

                                irregular = true;
                                y = c.height - 2;
                            }

                            let mut cnt = 0;

                            while ln > 0 {
                                if ln % 2 == 1 {
                                    // border nukigata (else: 1 * 1)
                                    katanuki(
                                        c,
                                        if cnt == 0 {
                                            0
                                        } else if rv_ul {
                                            3 * cnt
                                        } else {
                                            3 * cnt - 1
                                        },
                                        x + 1,
                                        if (!rv_ud && !rv_ul) || (!rv_lr && rv_ul) || cnt == 0 {
                                            y as i32
                                        } else {
                                            y as i32 - 1
                                        },
                                        Direction::Right,
                                    );

                                    x += 1 << cnt;
                                }

                                ln >>= 1;
                                cnt += 1;
                            }

                            katanuki(c, 0, x, y as i32, Direction::Up);

                            if irregular {
                                katanuki(c, 0, (j - k) as i32, c.height as i32 - 3, Direction::Up);
                            }

                            delta = get_delta(
                                &c.current_element_counts[c.height - 1],
                                &goal_element_counts[i],
                            );

                            is_filled = true;

                            break;
                        }
                    }
                }

                if is_filled {
                    break;
                }
            }
        }

        cnt_unmoved += 1;

        if i == 0 {
            katanuki(
                c,
                22,
                0,
                c.height as i32 - cnt_unmoved as i32,
                Direction::Down,
            );
        }
    }

    for i in (0..c.height).rev() {
        let goal_row = c.goal_board.get_row(i).unwrap().to_vec();

        // Only stripe
        if c.board.get_row(i).unwrap() == goal_row {
            continue;
        }

        for j in (0..c.width).rev() {
            let completed_rows = c.width - j - 1;
            let correct_cell = goal_row[j];

            for k in (completed_rows..c.width).rev() {
                let looking_cell = c.board.get(j, k).unwrap();

                if looking_cell == correct_cell {
                    katanuki(c, 0, k as i32, i as i32, Direction::Right);

                    break;
                }
            }
        }
    }

    c.board = multi_dereverse_cells(c.board.clone(), c.rv_op);
    c.goal_board = multi_dereverse_cells(c.goal_board.clone(), c.rv_op);

    let answer = Answer {
        n: c.ops.len() as u32,
        ops: c.ops.clone(),
    };

    AnswerSet {
        answer,
        board: cells_to_board(c.board.clone()),
    }
}

#[wasm_bindgen]
pub fn solve(problem: Problem, rv_op: ReverseOperationPatterns) -> AnswerSet {
    let height = problem.board.height as usize;
    let width = problem.board.width as usize;

    let mut c = Context::new(problem);

    c.rv_op = rv_op;

    if c.rv_op.has_reverse90 {
        c.width = height;
        c.height = width;
    }

    solve_func(&mut c)
}
