#/bin/sh

x=1
while [ $x -le 100 ]
do
  echo "Welcome $x times"
  x=$(( $x + 1 ))
  sleep 2
  curl http://localhost:8000/sendPressure?pressure="$x"
done