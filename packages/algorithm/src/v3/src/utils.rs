use crate::{arrays::TwoDimensionalCells, schemas::Board, types::ReverseOperationPatterns};

pub(crate) fn board_to_cells(b: &Board) -> (TwoDimensionalCells, TwoDimensionalCells) {
    let start = b
        .start
        .iter()
        .flat_map(|s| {
            s.chars()
                .map(|c| c.to_digit(10).and_then(|n| u8::try_from(n).ok()).unwrap())
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();

    let goal = b
        .goal
        .iter()
        .flat_map(|s| {
            s.chars()
                .map(|c| c.to_digit(10).and_then(|n| u8::try_from(n).ok()).unwrap())
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();

    (
        TwoDimensionalCells::from_vec(b.width as usize, b.height as usize, start),
        TwoDimensionalCells::from_vec(b.width as usize, b.height as usize, goal),
    )
}

pub(crate) fn cells_to_board(cells: TwoDimensionalCells) -> Vec<String> {
    cells
        .iter()
        .map(|cell| cell.to_string())
        .collect::<Vec<_>>()
        .chunks(cells.width)
        .map(|chunk| chunk.join(""))
        .collect::<Vec<_>>()
}

pub(crate) fn count_elements_column_wise(cells: &TwoDimensionalCells) -> Vec<[u32; 4]> {
    (0..cells.height)
        .map(|i| {
            (0..cells.width).fold([0; 4], |mut acc, j| {
                acc[cells.get(i, j).unwrap() as usize] += 1;

                acc
            })
        })
        .collect()
}

pub(crate) fn get_delta(current_row_counts: &[u32; 4], target_row_counts: &[u32; 4]) -> [i32; 4] {
    current_row_counts
        .iter()
        .zip(target_row_counts)
        .fold([0; 4], |mut delta, (current, target)| {
            delta[*target as usize] = *target as i32 - *current as i32;

            delta
        })
}

pub(crate) enum ReverseOperation {
    Reverse90,
    ReverseUpDown,
    ReverseLeftRight,
}

pub(crate) fn reverse_cells(
    cells: TwoDimensionalCells,
    op: ReverseOperation,
) -> TwoDimensionalCells {
    match op {
        ReverseOperation::Reverse90 => cells.transpose().reverse_row_wise(),
        ReverseOperation::ReverseUpDown => cells.reverse_row_wise(),
        ReverseOperation::ReverseLeftRight => cells.reverse_column_wise(),
    }
}

pub(crate) fn multi_reverse_cells(
    mut cells: TwoDimensionalCells,
    rv_op: ReverseOperationPatterns,
) -> TwoDimensionalCells {
    if rv_op.has_reverse90 {
        cells = reverse_cells(cells, ReverseOperation::Reverse90);

        if rv_op.has_reverse_left_right {
            cells = reverse_cells(cells, ReverseOperation::ReverseUpDown);
        }

        if rv_op.has_reverse_up_down {
            cells = reverse_cells(cells, ReverseOperation::ReverseLeftRight);
        }
    } else {
        if rv_op.has_reverse_left_right {
            cells = reverse_cells(cells, ReverseOperation::ReverseLeftRight);
        }

        if rv_op.has_reverse_up_down {
            cells = reverse_cells(cells, ReverseOperation::ReverseUpDown);
        }
    }

    cells
}

pub(crate) fn multi_dereverse_cells(
    mut cells: TwoDimensionalCells,
    rv_op: ReverseOperationPatterns,
) -> TwoDimensionalCells {
    if rv_op.has_reverse90 {
        if rv_op.has_reverse_left_right {
            cells = reverse_cells(cells, ReverseOperation::ReverseUpDown);
        }

        if rv_op.has_reverse_up_down {
            cells = reverse_cells(cells, ReverseOperation::ReverseLeftRight);
        }

        cells = reverse_cells(cells, ReverseOperation::Reverse90);
    } else {
        if rv_op.has_reverse_left_right {
            cells = reverse_cells(cells, ReverseOperation::ReverseLeftRight);
        }

        if rv_op.has_reverse_up_down {
            cells = reverse_cells(cells, ReverseOperation::ReverseUpDown);
        }
    }

    cells
}
