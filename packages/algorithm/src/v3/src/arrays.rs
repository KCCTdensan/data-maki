use std::{cmp::Ordering, mem};

#[derive(Clone, Debug, PartialEq, Eq)]
pub(crate) struct TwoDimensionalCells {
    inner: Vec<u8>,
    pub(crate) width: usize,
    pub(crate) height: usize,
}

impl TwoDimensionalCells {
    pub(crate) fn new(width: usize, height: usize) -> Self {
        Self {
            inner: vec![0; width * height],
            width,
            height,
        }
    }

    pub(crate) fn from_slice(width: usize, height: usize, slice: &[u8]) -> Self {
        let mut inner = vec![0; width * height];

        inner.copy_from_slice(slice);

        Self {
            inner,
            width,
            height,
        }
    }

    pub(crate) fn len(&self) -> usize {
        self.inner.len()
    }

    pub(crate) fn from_vec(width: usize, height: usize, vec: Vec<u8>) -> Self {
        Self {
            inner: vec,
            width,
            height,
        }
    }

    pub(crate) fn iter(&self) -> impl Iterator<Item = u8> + '_ {
        self.inner.iter().copied()
    }

    pub(crate) fn get(&self, row_index: usize, column_index: usize) -> Option<u8> {
        if row_index >= self.height || column_index >= self.width {
            return None;
        }

        Some(self.inner[row_index * self.width + column_index])
    }

    pub(crate) fn get_multiple(&self, offset: usize, length: usize) -> Option<&[u8]> {
        if offset >= self.inner.len() || offset + length > self.inner.len() {
            return None;
        }

        Some(&self.inner[offset..offset + length])
    }

    pub(crate) fn get_row(&self, idx: usize) -> Option<&[u8]> {
        if idx >= self.height {
            return None;
        }

        self.get_multiple(idx * self.width, self.width)
    }

    pub(crate) fn get_column(&self, idx: usize) -> Option<Vec<u8>> {
        if idx >= self.width {
            return None;
        }

        let mut result = Vec::with_capacity(self.inner.len());

        for (i, result_item) in result.iter_mut().enumerate().take(self.inner.len()) {
            *result_item = self.inner[idx + i * self.width];
        }

        Some(result)
    }

    pub(crate) fn set(&mut self, row_index: usize, column_index: usize, value: u8) {
        if row_index >= self.height || column_index >= self.width {
            eprintln!("Index out of bounds: {}, {}", row_index, column_index);
        }

        self.inner[row_index * self.width + column_index] = value;
    }

    pub(crate) fn set_multiple(&mut self, offset: usize, values: &[u8]) {
        if offset >= self.inner.len() || offset + values.len() > self.inner.len() {
            eprintln!("Index out of bounds: {}, {}", offset, values.len());
        }

        self.inner[offset..values.len()].copy_from_slice(values);
    }

    pub(crate) fn set_row(&mut self, idx: usize, row: &[u8]) {
        if idx >= self.height {
            eprintln!("Index out of bounds: {}", idx);
        }

        if row.len() != self.width {
            eprintln!("Invalid column size: {} !== {}", row.len(), self.width);
        }

        self.set_multiple(idx * self.width, row);
    }

    fn transpose_inner(&self) -> Vec<u8> {
        let mut new_inner = Vec::with_capacity(self.inner.len());

        for i in 0..self.height {
            for j in 0..self.width {
                new_inner[j * self.height + i] = self.inner[i * self.width + j];
            }
        }

        new_inner
    }

    pub(crate) fn transpose_in_place(&mut self) {
        self.inner = self.transpose_inner();

        mem::swap(&mut self.width, &mut self.height);
    }

    pub(crate) fn transpose(self) -> Self {
        Self::from_vec(self.height, self.width, self.inner)
    }

    pub(crate) fn reverse_row_wise_in_place(&mut self) {
        for i in 0..(self.height / 2) {
            for j in 0..self.width {
                let v1 = i * self.width + j;
                let v2 = (self.height - 1 - i) * self.width + j;

                let (low, high) = match v1.cmp(&v2) {
                    Ordering::Less => (v1, v2),
                    Ordering::Greater => (v2, v1),
                    Ordering::Equal => continue,
                };

                let (a, b) = self.inner.split_at_mut(high);

                mem::swap(&mut a[low], &mut b[0]);
            }
        }
    }

    pub(crate) fn reverse_row_wise(self) -> Self {
        let mut new_self = self.clone();

        new_self.reverse_row_wise_in_place();

        new_self
    }

    pub(crate) fn reverse_column_wise_in_place(&mut self) {
        for i in 0..self.height {
            for j in 0..(self.width / 2) {
                let v1 = i * self.width + j;
                let v2 = i * self.width + self.width - 1 - j;

                let (low, high) = match v1.cmp(&v2) {
                    Ordering::Less => (v1, v2),
                    Ordering::Greater => (v2, v1),
                    Ordering::Equal => continue,
                };

                let (a, b) = self.inner.split_at_mut(high);

                mem::swap(&mut a[low], &mut b[0]);
            }
        }
    }

    pub(crate) fn reverse_column_wise(self) -> Self {
        let mut new_self = self.clone();

        new_self.reverse_column_wise_in_place();

        new_self
    }
}
