use crate::{
    katanuki::katanuki_board,
    types::{Context, Direction, Point},
    utils::{count_elements_column_wise, get_delta},
};

pub(crate) fn evaluate_row(
    c: &mut Context,
    p: u32,
    pp: Point,
    goal_element_counts: [u32; 4],
) -> i32 {
    let board = katanuki_board(c, p, pp.x, pp.y, Direction::Up);
    let element_counts = count_elements_column_wise(&board);
    let delta = get_delta(&element_counts[c.height - 1], &goal_element_counts);

    let mut value = 0;

    for i in delta {
        if i >= 0 {
            value += i;
        }
    }

    value
}

pub(crate) fn evaluate_column_piece(
    c: &mut Context,
    p: u32,
    pp: Point,
    goal_column: Vec<u8>,
) -> i32 {
    let board = katanuki_board(c, p, pp.x, pp.y, Direction::Left);
    let column = board.get_column(c.width - 1).unwrap();

    let mut value = 0;

    for i in 0..c.height {
        if column[i] != goal_column[i] {
            value += 1;
        }
    }

    value
}
