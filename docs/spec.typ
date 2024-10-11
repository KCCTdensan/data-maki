#import "@preview/indenta:0.0.3": fix-indent

#let title = "寿司が好きなコンピュータ、何か知ってる？\n「データ巻き」ってね"
#let school = "神戸市立工業高等専門学校"
#let number = "30058"

#set document(title: title)

#set text(
  lang: "ja",
  font: "Harano Aji Mincho",
  size: 10.5pt, // Procon spec
)

#set page(
  paper: "a4",
  margin: (x: 25mm, top: 30mm, bottom: 25mm), // Procon spec
)

#set par(justify: true, first-line-indent: 1em)

#set heading(numbering: (..nums) => if nums.pos().len() == 1 {
  [#nums.pos().at(0).]
} else {
  nums.pos().map(str).join(".")
})

#show heading: it => context { set text(font: "Harano Aji Gothic", weight: "regular",
size: 10.5pt)

let it_width = measure(text(size: 10.5pt, it)).width

[
#it
#v(-(1em + 1pt))
#line(length: it_width)
] }

#set enum(numbering: "(1.a)")

#show figure.caption: text.with(font: "Harano Aji Gothic") // Procon spec

#show "、": "，"
#show "。": "．"

#context [
#set text(font: "Harano Aji Gothic")

#text(size: 12pt)[第35回競技部門：#number]

#set text(size: 14pt)

#align(center)[
  タイトル：#title

  #v(.5em)

  学校名：#school
]
]

#v(3em)

#show: columns.with(2)
#show: fix-indent()

= はじめに

今回の課題では、後述する基本の動きを一般化し、そこから考えられる最適解を見つけるような戦略を取る。

= アプローチ

// 一旦は今のシステムを書く，時間ありそうだったら行全体確定版の文も書く
== 大まかな流れ

基本の動きでは、主に行と列を別々に揃えていく戦略にした。その流れを以下に示す。

+ 最終盤面を下の行から順に走査し、各行の0-3の各要素数を揃える
  + 縦方向の寄せのみで過剰な要素を不足した要素で置換する
  + 残った過剰な要素のピースを、ピース近隣列の不足した要素で置換する
+ 最終盤面を右列から順に走査し、各列を横方向の寄せのみで揃える

== ピースの移動法

ピースの移動は、目標位置までに存在するピースを抜いて移動させる。定型抜き型のみでは、移動させたい距離を$N$と置くと必要手数は$O(log N)$手となる。
一方、盤面端に移動させるだけの場合は、移動させたいピースを抜いて移動させると、1手で済む。
これにより、一番下の行・一番右の列に揃え、反対側に移動させることで、より少ない手数で盤面を揃えられる。

また、(1.b)では、揃えている行と平行に移動させる必要がある。盤面端に揃えることは難しいため、先述の$O(log N)$手で揃える。
しかし、揃えている途中の一番下の行を回避して型抜きする必要があるため、定型抜き型のタイプIIを用いて、盤面の崩れを防ぐ。

== 複数のパターン・抜き型の選択

前述の流れは、下の行から右の列という順番になっている。しかし、走査の始点と終点で8通りのパターンがあるため、全て検証し、最適な流れを見つける。
このために、初めから盤面をそれぞれ反転させた状態で同様の流れを並列で処理する。

課題では、適切な抜き型の使用が手数省略の最大のカギである。そこで、盤面の崩れない定型抜き型を使用した際の過剰な要素数などから各評価値を判断する。
各評価値を比較し、最適な抜き型の種類を決定する。

= システム

全体をJavaScriptで実装し、ソルバとUIで実装を分割している。

== ソルバ

Promiseを利用した非同期処理をベースに、WebWorkerで並列化している。

具体的には、サーバ・UIとの通信、アルゴリズムの実行をマイクロサービスとして分割している。
プログラム全体をステートマシンとして構築して、サービス間で状態を共有できる仕組みにしている。

実行時は、最適化された単独バイナリとして実行できるようにビルドする。

== UI

Reactを利用し、サーバからのイベントストリームを受け取り、ソルバの進捗をリアルタイムで表示する。#ref(<fig:ui>) にUIのイメージを示す。

#figure(image("figures/ui.png", width: 82.5%), caption: [UIのイメージ]) <fig:ui>
