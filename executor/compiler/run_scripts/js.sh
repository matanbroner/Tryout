prog=$1

output="$(node $prog.js)"

echo "$output"

rm prog.js