#/bin/sh

x=1
while [ $x -le 100 ]
do
  echo "Welcome $x times"
  x=$(( $x + 1 ))
  sleep 2

<<<<<<< HEAD
  curl http://sensorapiturings.herokuapp.com/sendTemperature?temp=56\&hum="$x"
  curl http://sensorapiturings.herokuapp.com/sendPressure?pressure=112
=======
  curl http://sensorapiturings.herokuapp.com/sendFurnaceTemperature?furnaceCel="$x"\&furnaceFah="$x"
>>>>>>> d2994b319fe7bea73c0a8de22930c989d2eb3715
done