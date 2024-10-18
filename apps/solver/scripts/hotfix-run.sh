bun run build
bun build --minify --compile --target=bun-linux-x64 --outfile=dist/solver-hotfix-linux-x64 dist/index.js $(find dist -name '*.js' -not -name 'index.js')

dist/solver-hotfix-linux-x64
