prog=$1

cd $(dirname "${prog}")
filename="$(basename $prog)"

javac $filename
output="$(java ${filename%.*})"

echo "$output"
rm "${filename%.*}.class"
