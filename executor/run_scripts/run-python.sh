prog=$1

output="$(python3 prog.py)"

echo "$output"

rm prog.py