#![allow(
    clippy::let_and_return,
    clippy::type_complexity,
    clippy::unused_unit,
    clippy::manual_non_exhaustive,
    clippy::redundant_closure
)]

#[allow(unused)]
use super::*;
#[allow(unused)]
use wasm_bindgen::prelude::*;
#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct General {
    pub n: u32,
    pub patterns: Vec<Pattern>,
}
#[allow(non_camel_case_types, non_snake_case)]
pub trait General_Trait {
    fn set_n(&mut self, value: u32) -> std::result::Result<(), JsValue>;
    fn n(&self) -> std::result::Result<u32, JsValue>;
    fn set_patterns(&mut self, value: Vec<Pattern>) -> std::result::Result<(), JsValue>;
    fn patterns(&self) -> std::result::Result<Vec<Pattern>, JsValue>;
}
impl General_Trait for General {
    fn set_n(&mut self, value: u32) -> std::result::Result<(), JsValue> {
        self.n = value;
        Ok(())
    }
    fn n(&self) -> std::result::Result<u32, JsValue> {
        Ok(self.n)
    }
    fn set_patterns(&mut self, value: Vec<Pattern>) -> std::result::Result<(), JsValue> {
        self.patterns = value;
        Ok(())
    }
    fn patterns(&self) -> std::result::Result<Vec<Pattern>, JsValue> {
        Ok(self.patterns.clone())
    }
}
#[derive(Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct Problem {
    pub general: General,
    pub board: Board,
}
#[allow(non_camel_case_types, non_snake_case)]
pub trait Problem_Trait {
    fn set_general(&mut self, value: General) -> std::result::Result<(), JsValue>;
    fn general(&self) -> std::result::Result<General, JsValue>;
    fn set_board(&mut self, value: Board) -> std::result::Result<(), JsValue>;
    fn board(&self) -> std::result::Result<Board, JsValue>;
}
impl Problem_Trait for Problem {
    fn set_general(&mut self, value: General) -> std::result::Result<(), JsValue> {
        self.general = value;
        Ok(())
    }
    fn general(&self) -> std::result::Result<General, JsValue> {
        Ok(self.general.clone())
    }
    fn set_board(&mut self, value: Board) -> std::result::Result<(), JsValue> {
        self.board = value;
        Ok(())
    }
    fn board(&self) -> std::result::Result<Board, JsValue> {
        Ok(self.board.clone())
    }
}
#[derive(Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct Pattern {
    pub width: u32,
    pub cells: Vec<String>,
    pub height: u32,
    pub p: u32,
}
#[allow(non_camel_case_types, non_snake_case)]
pub trait Pattern_Trait {
    fn set_width(&mut self, value: u32) -> std::result::Result<(), JsValue>;
    fn width(&self) -> std::result::Result<u32, JsValue>;
    fn set_p(&mut self, value: u32) -> std::result::Result<(), JsValue>;
    fn p(&self) -> std::result::Result<u32, JsValue>;
    fn set_cells(&mut self, value: Vec<String>) -> std::result::Result<(), JsValue>;
    fn cells(&self) -> std::result::Result<Vec<String>, JsValue>;
    fn set_height(&mut self, value: u32) -> std::result::Result<(), JsValue>;
    fn height(&self) -> std::result::Result<u32, JsValue>;
}
impl Pattern_Trait for Pattern {
    fn set_width(&mut self, value: u32) -> std::result::Result<(), JsValue> {
        self.width = value;
        Ok(())
    }
    fn width(&self) -> std::result::Result<u32, JsValue> {
        Ok(self.width)
    }
    fn set_p(&mut self, value: u32) -> std::result::Result<(), JsValue> {
        self.p = value;
        Ok(())
    }
    fn p(&self) -> std::result::Result<u32, JsValue> {
        Ok(self.p)
    }
    fn set_cells(&mut self, value: Vec<String>) -> std::result::Result<(), JsValue> {
        self.cells = value;
        Ok(())
    }
    fn cells(&self) -> std::result::Result<Vec<String>, JsValue> {
        Ok(self.cells.clone())
    }
    fn set_height(&mut self, value: u32) -> std::result::Result<(), JsValue> {
        self.height = value;
        Ok(())
    }
    fn height(&self) -> std::result::Result<u32, JsValue> {
        Ok(self.height)
    }
}
#[derive(Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct Board {
    pub goal: Vec<String>,
    pub start: Vec<String>,
    pub width: u32,
    pub height: u32,
}
#[allow(non_camel_case_types, non_snake_case)]
pub trait Board_Trait {
    fn set_start(&mut self, value: Vec<String>) -> std::result::Result<(), JsValue>;
    fn start(&self) -> std::result::Result<Vec<String>, JsValue>;
    fn set_width(&mut self, value: u32) -> std::result::Result<(), JsValue>;
    fn width(&self) -> std::result::Result<u32, JsValue>;
    fn set_height(&mut self, value: u32) -> std::result::Result<(), JsValue>;
    fn height(&self) -> std::result::Result<u32, JsValue>;
    fn set_goal(&mut self, value: Vec<String>) -> std::result::Result<(), JsValue>;
    fn goal(&self) -> std::result::Result<Vec<String>, JsValue>;
}
impl Board_Trait for Board {
    fn set_start(&mut self, value: Vec<String>) -> std::result::Result<(), JsValue> {
        self.start = value;
        Ok(())
    }
    fn start(&self) -> std::result::Result<Vec<String>, JsValue> {
        Ok(self.start.clone())
    }
    fn set_width(&mut self, value: u32) -> std::result::Result<(), JsValue> {
        self.width = value;
        Ok(())
    }
    fn width(&self) -> std::result::Result<u32, JsValue> {
        Ok(self.width)
    }
    fn set_height(&mut self, value: u32) -> std::result::Result<(), JsValue> {
        self.height = value;
        Ok(())
    }
    fn height(&self) -> std::result::Result<u32, JsValue> {
        Ok(self.height)
    }
    fn set_goal(&mut self, value: Vec<String>) -> std::result::Result<(), JsValue> {
        self.goal = value;
        Ok(())
    }
    fn goal(&self) -> std::result::Result<Vec<String>, JsValue> {
        Ok(self.goal.clone())
    }
}

#[derive(Clone, Debug, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct Answer {
    pub ops: Vec<Op>,
    pub n: u32,
}
#[allow(non_camel_case_types, non_snake_case)]
pub trait Answer_Trait {
    fn set_n(&mut self, value: u32) -> std::result::Result<(), JsValue>;
    fn n(&self) -> std::result::Result<u32, JsValue>;
    fn set_ops(&mut self, value: Vec<Op>) -> std::result::Result<(), JsValue>;
    fn ops(&self) -> std::result::Result<Vec<Op>, JsValue>;
}
impl Answer_Trait for Answer {
    fn set_n(&mut self, value: u32) -> std::result::Result<(), JsValue> {
        self.n = value;
        Ok(())
    }
    fn n(&self) -> std::result::Result<u32, JsValue> {
        Ok(self.n)
    }
    fn set_ops(&mut self, value: Vec<Op>) -> std::result::Result<(), JsValue> {
        self.ops = value;
        Ok(())
    }
    fn ops(&self) -> std::result::Result<Vec<Op>, JsValue> {
        Ok(self.ops.clone())
    }
}
#[derive(Clone, Debug, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen]
pub struct Op {
    pub p: u32,
    pub y: i32,
    pub x: i32,
    pub s: u8,
}
#[allow(non_camel_case_types, non_snake_case)]
pub trait Op_Trait {
    fn set_p(&mut self, value: u32) -> std::result::Result<(), JsValue>;
    fn p(&self) -> std::result::Result<u32, JsValue>;
    fn set_s(&mut self, value: u8) -> std::result::Result<(), JsValue>;
    fn s(&self) -> std::result::Result<u8, JsValue>;
    fn set_x(&mut self, value: i32) -> std::result::Result<(), JsValue>;
    fn x(&self) -> std::result::Result<i32, JsValue>;
    fn set_y(&mut self, value: i32) -> std::result::Result<(), JsValue>;
    fn y(&self) -> std::result::Result<i32, JsValue>;
}
impl Op_Trait for Op {
    fn set_p(&mut self, value: u32) -> std::result::Result<(), JsValue> {
        self.p = value;
        Ok(())
    }
    fn p(&self) -> std::result::Result<u32, JsValue> {
        Ok(self.p)
    }
    fn set_s(&mut self, value: u8) -> std::result::Result<(), JsValue> {
        self.s = value;
        Ok(())
    }
    fn s(&self) -> std::result::Result<u8, JsValue> {
        Ok(self.s)
    }
    fn set_x(&mut self, value: i32) -> std::result::Result<(), JsValue> {
        self.x = value;
        Ok(())
    }
    fn x(&self) -> std::result::Result<i32, JsValue> {
        Ok(self.x)
    }
    fn set_y(&mut self, value: i32) -> std::result::Result<(), JsValue> {
        self.y = value;
        Ok(())
    }
    fn y(&self) -> std::result::Result<i32, JsValue> {
        Ok(self.y)
    }
}
