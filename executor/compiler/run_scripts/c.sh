prog=$1

cd $(dirname "${prog}")
filename="$(basename $prog)"

gcc -o ${filename%.*} $filename
output="$(./${filename%.*})"

echo "$output"