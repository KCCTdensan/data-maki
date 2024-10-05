# Require:
1. `flake8`
2. `black`
3. `isort`
4. `pre-commit`

上記4点が必要です。

(Arch Linuxユーザ向け)
```sh
yay -S flake8 python-black python-isort pre-commit
```
で入ります。

# How to Use:
```sh
pre-commit .pre-commit-config.yaml 
```
を実行してください
