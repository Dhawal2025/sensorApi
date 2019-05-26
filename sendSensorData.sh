#/bin/sh

y=1
$ echo $RANDOM
while [ $y -le 100 ]
do
  echo "Welcome $x times"
  y=$(( $y + 1 ))
  curl http://sensorapiturings.herokuapp.com/sendFurnaceTemperature?furnaceCel="$x"\&furnaceFah="$x"
  curl http://sensorapiturings.herokuapp.com/sendPressure?pressure="$x"
  curl http://sensorapiturings.herokuapp.com/sendTemperature?temp="$x"\&hum="$x"\&ppm="$x"

  x=$((RANDOM%100))
  sleep 2
done