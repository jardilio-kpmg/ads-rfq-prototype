Vagrant.configure("2") do |config|
  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.vm.network "forwarded_port", guest: 9000, host: 9000
  config.vm.network "forwarded_port", guest: 9001, host: 9001
  config.vm.network "forwarded_port", guest: 9002, host: 9002
  config.vm.network "forwarded_port", guest: 9003, host: 9003
  config.vm.network "forwarded_port", guest: 9004, host: 9004
  config.vm.network "forwarded_port", guest: 9005, host: 9005
  
  config.vm.network "forwarded_port", guest: 8000, host: 8000
  config.vm.network "forwarded_port", guest: 8001, host: 8001
  config.vm.network "forwarded_port", guest: 8002, host: 8002
  config.vm.network "forwarded_port", guest: 8003, host: 8003
  config.vm.network "forwarded_port", guest: 8004, host: 8004
  config.vm.network "forwarded_port", guest: 8005, host: 8005

  config.vm.provision "shell", inline: "sudo apt-get update"
  config.vm.provision "shell", inline: "sudo apt-get install -y git"
  config.vm.provision "shell", inline: "sudo apt-get install -y ruby"
  config.vm.provision "shell", inline: "sudo apt-get install -y curl"
  config.vm.provision "shell", inline: "sudo curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -"
  config.vm.provision "shell", inline: "sudo apt-get install -y nodejs"
  config.vm.provision "shell", inline: "echo '\nPATH=$PATH:/vagrant/node_modules/.bin\ncd /vagrant\nnpm prune && npm install && bower prune && bower install && grunt' >> /home/vagrant/.bashrc"
end