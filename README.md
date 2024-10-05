# Require:

パッケージ管理ツールとして`Rye`を使います。

# How to Use:

(もしかしたら初回にいるかも:
```sh
rye sync && pre-commit install
```
)

実行:
```sh
rye run data-maki
```
src/data_maki/cli/__init__.pyのmain関数を実行します。このファイルからsrc/__init__.pyのソルバーを呼び出すようにしてください。

pythonのファイルは`src/data_maki/`以下に置いてください。
