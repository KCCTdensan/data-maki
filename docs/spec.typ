#import "@preview/indenta:0.0.3": fix-indent

#let title = "データ巻き (仮)"
#let school = "神戸市立工業高等専門学校"
#let number = "TBD"

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
#v(2pt)
] }

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

今回の型抜きパズルは、抜き型の種類や使用する位置など、非常に分岐が多いものとなっている。そこで、私たちは後述する基本の動きを一般化し、そこから考えられる最適解を見つけるような戦略を取ることとした。

= アプローチ

// 一旦は今のシステムを書く，時間ありそうだったら行全体確定版の文も書く
今回作成した基本の動きでは、主に行と列を別々に揃えていくような戦略となっている。大まかな流れを以下に示す。

+ 最終盤面の各行の、0-3の各要素の

= システム

全体をJavaScriptで構築し、ソルバーとUIでそれぞれの実装を分割している。

== ソルバー

Promiseを利用した非同期処理をベースに、アルゴリズム部をWebWorkerに分割してメインスレッドから分断している。
これによって、アルゴリズムを別のCPUコアで動作させることができ、CPUバウンドな処理でロギングをブロックしないようにしたり、並列化したりできるようになる。

具体的な処理形態は、サーバーとの通信、UIとの通信、アルゴリズムの実行をそれぞれマイクロサービスとして分割している。
プログラム全体をステートマシンとして構築して、マイクロサービス全体で状態を共有できる仕組みにしている。
補助的なものとして、一方向に送受信可能なデータチャネルを用いて相互に通信を行うようにしている。

実行時は、ランタイムが解釈しやすいバイトコードにAOTコンパイルした上でランタイムそのものも同梱したバイナリを事前生成し、実行することで移植性とパフォーマンスの向上に努めている。

== UI

Reactを利用し、HTTPでサーバーからのSSE (Server Sent Event)をリッスンして、ソルバーの進捗をリアルタイムで表示するようにしている。
ソルバーと完全に分離することで、時間のかかる処理が行われている間もUIはブロックされない。
