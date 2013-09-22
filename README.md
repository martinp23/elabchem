![logo](http://i.imgur.com/pgyfu4I.png)


# Description
eLabChem is a fork of [eLabFTW](http://www.elabftw.net) which incorporates chemistry functions, such as a chemical structure
drawing tool and automatic stoichiometry table generation. A demo can be tried [here](http://nitrogen.martinp23.com/elabchem). 
The demo username/pass is demo/pass.

eLabChem should work on all modern browsers, including on tablet computers (iPad, etc).

This README file is a modified version of the original eLabFTW readme. 

# Installation
Thank you for choosing eLabChem as a lab manager,
Please report bugs on [github](https://github.com/martinp23/elabchem/issues).

eLabChem was designed to be installed on a server, and people from the team would just log into it from their browser.

Don't have a server? That's okay, you can use an old computer with 1 GB of RAM and an old CPU, it's more than enough. Just install a recent GNU/Linux distribution on it.

You could also consider buying a [http://www.raspberrypi.org/](Raspberry Pi) (£25 computer), which should work fine with eLabChem.

But you can also install it locally and use it for yourself only. Here is how:

### Install locally on Mac OS
Please [follow the instructions on the eLabFTW wiki](https://github.com/NicolasCARPi/elabftw/wiki/installmac).

For the "PHP Part", substitute the git command for:
~~~ sh
$ git clone https://github.com/martinp23/elabchem.git
~~~

And remember that all the files will be in the resulting "elabchem" directory, not "elabftw".

You will also need to install [OpenBabel](http://openbabel.org/wiki/Main_Page) (from the OpenBabel homepage) and [mychem](http://mychem.sourceforge.net/), as described:

#### myChem in MAMP 2.1.4 (Mac OS X)

This is a bit awkward because we need to download mysql again (in a redundant installation) because MAMP doesn't expose the necessary library. This is nasty and hacky! You'd probably be better off setting up your own MAMP stack following, say ( http://silicos-it.com/cookbook/configuring_osx_for_chemoinformatics/configuring_osx_for_chemoinformatics.html#mychem-cartridge-for-openbabel ) 

Make sure that you install the openbabel binary as directed on openbabel.org.

Get cmake from http://www.cmake.org/cmake/resources/software.html

Make sure you have a C/C++ compiler (ideally GCC), via macports or XCode, and subversion.

Get the relevant mysql package depending on your architecture (x86 or x86_64) from:

 * x86 (32 bit) http://downloads.skysql.com/archive/signature/p/mysql/f/mysql-5.5.25-osx10.6-x86.dmg/v/5.5.25
 * x86_64 (64 bit) http://downloads.skysql.com/archive/signature/p/mysql/f/mysql-5.5.25-osx10.6-x86_64.dmg/v/5.5.25

 and install mysql.

With the pre-requisites taken care of:
~~~ sh
$ svn co https://mychem.svn.sourceforge.net/svnroot/mychem/mychem3@351 mychem
$ cd mychem
$ mkdir build
$ cd build
$ cmake -DOPENBABEL2_INCLUDE_DIR=/usr/local/include/openbabel-2.0/ -DOPENBABEL2_LIBRARIES=/usr/local/lib/libopenbabel.dylib -DMYSQL_INCLUDE_DIR=/usr/local/mysql/include -DMYSQL_LIBRARIES=/usr/local/mysql/lib/libmysqlclient.dylib -DCMAKE_INSTALL_PREFIX=/Applications/MAMP/Library/lib/plugin/ ..
$ make
$ make install
$ cd /Applications/MAMP/Library/lib/plugin
$ ln -s lib/libmychem.dylib libmychem.so
$ otool -L libmychem.so  # this will show that libmychem.so does not specify the location of the libmysqlclient library. So we add it
$ install_name_tool -change libmysqlclient.18.dylib /usr/local/mysql-5.5.29-osx10.6-{x86 or x86_64}/lib/libmysqlclient.18.dylib libmychem.so
$ mysql -u root -p < ../src/mychemdb.sql
~~~

### Install locally on Windows
Please [follow the instructions on the eLabFTW wiki](https://github.com/NicolasCARPi/elabftw/wiki/installwin).
For the "Get the files", substitute the git command for:
~~~ sh
$ git clone https://github.com/martinp23/elabchem.git
~~~

And remember that all the files will be in the resulting "elabchem" directory, not "elabftw".

You will also need to install [OpenBabel](http://openbabel.org/wiki/Main_Page) (from the OpenBabel homepage) and [mychem](http://mychem.sourceforge.net/). Consult the MyChem documentation for help installing on Windows.
## Install on Unix-like OS (GNU/Linux, BSD, Solaris, etc…) (the recommended way!)
Please refer to your distribution's documentation to install :
* a webserver (Apache2 is recommended)
* php5
* mysql
* git
* [mychem](http://mychem.sourceforge.net/)
* [openbabel](http://openbabel.org/wiki/Main_Page)

For Debian/Ubuntu (recommended), most of this can be installed quickly using Apt:
~~~ sh 
$ sudo apt-get update
$ sudo apt-get upgrade
$ sudo apt-get install mysql-server mysql-client apache2 php5 php5-mysql libapache2-mod-php5 git gcc cmake libmysqlclient-dev libopenbabel-dev openbabel subversion build-essential php5-curl
~~~

Make sure to put a root password on your mysql installation :
~~~ sh
$ sudo /usr/bin/mysql_secure_installation
~~~

However, we need to spend a small amount of time manually building and installing mychem

 svn revid 351 is known to work with MAMP 2.1.4 (mysql 5.5.29) and Debian Wheezy (mysql 5.5.31, on raspberry pi).

For Debian Wheezy:
~~~ sh
$ svn co https://mychem.svn.sourceforge.net/svnroot/mychem/mychem3@351 mychem
$ cd mychem
$ mkdir build
$ cd build
$ cmake ..
$ make
$ sudo make install
$ mysql -u root -p < ../src/mychemdb.sql
~~~

On a new Wheezy install, you may need to pass the following flags to cmake:
-DOPENBABEL2_INCLUDE_DIR=/usr/include/openbabel-2.0 -DOPENBABEL2_LIBRARIES=/usr/lib/libopenbabel.so

To check installation in mysql, either use the tests provided in the mychem package or:
~~~ mysql
mysql> SELECT MYCHEM_VERSION();
~~~

## Getting the eLabChem files

### Connect to your server with SSH
~~~ sh
ssh user@12.34.56.78
~~~

### cd to the public directory where you want eLabChem to be installed
(can be /var/www, ~/public\_html, or any folder you'd like)
~~~ sh
$ cd /var/www
# make the directory writable by your user
$ sudo chown `whoami`:`whoami` .
~~~
Note the `.` at the end that means `current folder`.

### Get latest stable version via git :
~~~ sh
$ git clone https://github.com/martinp23/elabchem.git
~~~
(this will create a folder `elabchem`)

If you cannot connect, try exporting your proxy settings in your shell like so :
~~~ sh
$ export https_proxy="proxy.example.com:3128"
~~~
If you still cannot connect, tell git your proxy :
~~~ sh
$ git config --global http.proxy http://proxy.example.com:8080
~~~

If you can't install git or don't manage to get the files, you can [download a zip archive](https://github.com/martinp23/elabchem/archive/master.zip). But it's better to use git, it will allow easier updates.

### Create the uploads folders and fix the permissions
~~~ sh
$ cd elabchem
$ mkdir -p uploads/{tmp,export,internal}
$ chmod -R 777 uploads
~~~

## SQL part
The second part is putting the database in place.
### Command line way (graphical way below)
~~~ sh
# first we connect to mysql
$ mysql -u root -p
# we create the database (note the ; at the end !)
mysql> create database elabchem;
# we create the user that will connect to the database.
mysql> grant usage on *.* to elabchem@localhost identified by 'YOUR_PASSWORD';
# we give all rights to this user on this database
mysql> grant all privileges on elabchem.* to elabchem@localhost;
mysql> exit
# now we import the database structure
$ mysql -u elabchem -p elabchem < install/elabftw.sql
~~~
You will be asked for the password you put after `identified by` three lines above.

*<- Ignore this (it's to fix a markdown syntax highlighting problem)

## Config file
Copy the file `admin/config.php-EXAMPLE` to `admin/config.php`.
~~~ sh
$ cp admin/config.php-EXAMPLE admin/config.php
~~~

Now edit this file with nano, a simple text editor. (Use vim/emacs at will, of course !)
~~~ sh
$ nano admin/config.php
~~~
I would recommend using an advanced text editor like (g)vim (GNU), notepad++ (Win) or TextWrangler (Mac) to benefit from syntax highlighting.

You need to edit the part between the quotes.

## Final step
Finally, point your browser to the install folder (install/) and read onscreen instructions.

For example : http://12.34.56.78/elabchem/install

******

# Updating
To update, just cd in the `elabchem` folder and do :
~~~ sh
$ git pull
$ php update.php
~~~

# Backup
It is important to backup your files to somewhere else, in case anything bad happens.
Please refer to the [eLabFTW wiki](https://github.com/NicolasCARPi/elabftw/wiki/backup) - you may need to make some small changes (switching "elabftw" for "elabchem") to any instructions there.

# HTTPS
If you want to enable HTTPS (and you should), uncomment (remove the # at the beginning) these lines in the file .htaccess. 
~~~sh
#RewriteEngine On
#RewriteCond %{HTTPS} !=on
#RewriteRule .* https://%{SERVER_NAME}%{REQUEST_URI} [R=301,L]
~~~

You will need the modules "rewrite" and "ssl" enabled, the package ssl-cert installed and the ssl site enabled.
~~~sh
$ sudo apt-get install ssl-cert
$ sudo a2enmod rewrite
$ sudo a2enmod ssl
$ sudo a2ensite default-ssl
~~~


# Installing the MarvinSketcher editor

The default structure editor is ChemDoodle's Web Components. However, you can also install MarvinSketcher.

Just get the marvin-bin-(...).zip file from [here](http://www.chemaxon.com/download/marvin/for-web-developers/) and unzip it into 
the lib/editors directory. Marvin should end up in the lib/editors/marvin directory.

Then, change the configuration variables in admin/config.php to enable the sketcher.

# Bonus stage
* It's a good idea to use a php optimizer to increase speed. I recommand installing XCache.
* You can show a TODOlist by pressing 't'.
* You can duplicate an experiment in one click.
* You can export in a .zip, a .pdf or a spreadsheet.
* You can share an experiment by just sending the URL of the page to someone else.





