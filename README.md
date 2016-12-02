# hackathon-pi

## setup raspbian

Download the Jesie light version of raspbian, and burn to flash disk using applepi-baker

## setup the pi

Connect, switch on and ssh into pi/raspberry
```
$ ssh pi@192.168.1.11 (or some such thing)
```

```
$ sudo apt-get update
$ sudo apt-get install fish, git, vim (installs fish shell)
```

Make fish your default shell
```
chsh -s /usr/bin/fish
```

Run and select the option to expand the filesystem and reboot. 
```
$sudo raspi-config
```

To install node and npm, look on for the right version at https://nodejs.org/en/download/
Board   Architecture
Raspberry Pi Zero/1 ARMv6
Raspberry Pi 2  ARMv7
Raspberry Pi 3  ARMv8

```
$ wget https://nodejs.org/dist/vX.X.X/node-vX.X.X-linux-armvXl.tar.xz
$ tar -xf node-vX.X.X-linux-armvXl.tar.xz
$ sudo mv node-vX.X.X-linux-armvXl /usr/local/node
$ cd /usr/local/bin
$ sudo ln -s /usr/local/node/bin/node node
$ sudo ln -s /usr/local/node/bin/npm npm
```

For Raspberry PI 3
```
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install -y nodejs
$ sudo apt-get install -y build-essential
```

Check node and npm versions.
```
$ node -v
$ npm -v
```

Clone the repo, change to the directory and run to download the node modules
```
$ npm install
```

To enable the sounds playing:
```
$ sudo apt-get update
$ sudo apt-get upgrade
$ sudo apt-get install alsa-base alsa-utils
```

Volume can be set using
```
alsamixer
```

## Disabling the Console

If you are using the serial port for anything other than the console you need to disable it. This will be slightly different depending on whether you are running a Raspberry Pi 3 or not.

For non Raspberry Pi 3 machines, remember it’s /dev/ttyAMA0 that is linked to the getty (console) service. So you need to perform this command from a terminal window:

```
$ sudo systemctl stop serial-getty@ttyAMA0.service
$ sudo systemctl disable serial-getty@ttyAMA0.service
```
The “disable” will stop it loading in the future.

For Raspberry Pi 3’s the command is similar but referencing /dev/ttyS0:
```
$ sudo systemctl stop serial-getty@ttyS0.service
$ sudo systemctl disable serial-getty@ttyS0.service
```
You also need to remove the console from the cmdline.txt. If you edit this with:
```
$ sudo vim /boot/cmdline.txt
```
you will see something like:
```
dwc_otg.lpm_enable=0 console=serial0,115200 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline fsck.repair=yes root wait
```
remove the part: console=serial0,115200 and save and reboot for changes to take effect.

### more serial stuff for rpi 3

add enable_uart=1 into /boot/config.txtx
or 
dtoverlay=pi3-miniuart-bt


## Test the Serial Port

A great way to test out the serial port is to use the minicom program. If you dont have this installed run
```
$ sudo apt-get install minicom
```
Connect your PC to the Raspberry Pi serial port using an appropriate serial port adapter and wiring, then open Putty or a similar serial terminal program on PC side. Setup a connection using the serial port at 9600 baud.

Now run up minicom on the Raspberry Pi 1 using
```
$ minicom -b 9600 -o -D /dev/ttyAMA0
```
What you type into the minicom terminal screen should appear on the serial PC terminal and vice versa.

## Connecting wifi Raspi 3

https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md

List networks
```
$ sudo iwlist wlan0 scan
```

Add network details to config file
```
$ sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
```

Go to the bottom of the file and add the following:
In the case of the example network, we would enter:
```
network={
    ssid="testing"
    psk="testingPassword"
}
```

Stop and restart network
```
$ sudo ifdown wlan0
$ sudo ifup wlan0
```

Check if its running
```
$ ifconfig wlan0
```
If it's got an address , it's working
