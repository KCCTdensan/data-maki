use crate::{
    arrays::TwoDimensionalCells,
    schemas::{Op, Problem},
    types::{get_pattern, Context, Direction, Point, DOWN, LEFT, UP},
    utils::{cells_to_board, count_elements_column_wise, reverse_cells, ReverseOperation},
};

struct PatternData {
    b: TwoDimensionalCells,
    bx: usize,
    by: usize,
    pw: usize,
    ph: usize,
    pp: Point,
    pattern: TwoDimensionalCells,
}

fn generate_pattern_data(
    dir: Direction,
    b: &TwoDimensionalCells,
    pattern: &TwoDimensionalCells,
    w: usize,
    h: usize,
    x: i32,
    y: i32,
) -> PatternData {
    let dir = dir.to_u8();

    if dir == UP || dir == DOWN {
        PatternData {
            b: reverse_cells(b.clone(), ReverseOperation::Reverse90),
            bx: h,
            by: w,
            pw: pattern.height,
            ph: pattern.width,
            pp: Point { x: y, y: x },
            pattern: reverse_cells(pattern.clone(), ReverseOperation::Reverse90),
        }
    } else {
        PatternData {
            b: b.clone(),
            bx: w,
            by: h,
            pw: pattern.width,
            ph: pattern.height,
            pp: Point { x, y },
            pattern: pattern.clone(),
        }
    }
}

pub(crate) fn katanuki_board(
    c: &mut Context,
    p: u32,
    x: i32,
    y: i32,
    s: Direction,
) -> TwoDimensionalCells {
    let s = s.to_u8();
    let pattern = get_pattern(p as usize, &c.patterns);

    if x + pattern.width as i32 <= 0
        || x >= c.width as i32
        || y + pattern.height as i32 <= 0
        || y >= c.height as i32
    {
        panic!("Pattern out of bounds");
    }

    let mut l = Point { x: 0, y: 0 };

    let PatternData {
        mut b,
        bx,
        by,
        pw,
        ph,
        pp,
        pattern,
    } = generate_pattern_data(
        Direction::from_u8(s),
        &c.board,
        &pattern.cells,
        c.width,
        c.height,
        x,
        y,
    );

    for i in 0..ph {
        l.y = pp.y + i as i32;

        // Out of range
        if l.y < 0 {
            continue;
        }
        if l.y >= by as i32 {
            break;
        }

        let mut current_row = b.get_row(l.y as usize).unwrap().to_vec();
        let mut picked: Vec<u8> = vec![];

        for j in (0..pw).rev() {
            l.x = pp.x + j as i32;

            // Out of range
            if l.x < 0 {
                continue;
            }

            if l.x >= bx as i32 {
                break;
            }

            if pattern.get(i, j).unwrap() == 0 {
                continue;
            }

            let pop_index = picked.iter().position(|&x| x == l.x as u8).unwrap();
            let removed_item = picked.remove(pop_index);

            picked.insert(0, removed_item);
        }

        if s == UP || s == LEFT {
            current_row.extend(picked);
        } else {
            let mut new_row = picked;

            new_row.extend(current_row);

            current_row = new_row;
        }

        b.set_row(l.y as usize, &current_row);
    }

    if s == UP || s == DOWN {
        reverse_cells(b, ReverseOperation::Reverse90)
    } else {
        b
    }
}

pub(crate) fn easy_katanuki(problem: Problem, op: Op) -> Vec<String> {
    let mut c = Context::new(problem);

    cells_to_board(katanuki_board(
        &mut c,
        op.p,
        op.x,
        op.y,
        Direction::from_u8(op.s),
    ))
}

pub(crate) fn katanuki(c: &mut Context, p: u32, x: i32, y: i32, s: Direction) {
    let b = katanuki_board(c, p, x, y, s);

    if c.board != b {
        c.board = b;
        c.current_element_counts = count_elements_column_wise(&c.board);

        c.add_op(Op {
            p,
            x,
            y,
            s: s.to_u8(),
        });
    }
}
