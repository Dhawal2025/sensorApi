#/bin/sh

y=1
$ echo $RANDOM
while [ $y -le 100 ]
do
  echo "Welcome $x times"
  y=$(( $y + 1 ))
  x=$((RANDOM%100))
  sleep 2
  curl http://sensorapiturings.herokuapp.com/sendTemperature?temp=56\&hum="$x"
  curl http://sensorapiturings.herokuapp.com/sendPressure?pressure=112
  curl http://sensorapiturings.herokuapp.com/sendFurnaceTemperature?furnaceCel="$x"\&furnaceFah="$x"

done