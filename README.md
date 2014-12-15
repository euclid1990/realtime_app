Realtime Chat Application
========

## Ứng dụng chat sử dụng NodeJS - Redis & PHP
#### Nguyên tắc hoạt động:
- Client kết nối tới Server thông qua websocket
- Với mỗi client sẽ subcribe 1 chanel tương ứng trên redis storage
- Khi có bất kỳ thay đổi nào được ghi (publish) trên chanel redis tương ứng của user, nội dung message sẽ được emit ngược lại client.
- Với public notification: emit toàn bộ clients đang connect (Khi người dùng gửi message)
- Với private notification: emit client mong muốn nhận notify (Khi người dùng poke nhau)

## Hướng dẫn sử dụng:
Cần cài đặt các thành phần sau khi sử dụng:
- Apache 2.4 & PHP 5.4:
```
# sudo subl /etc/apache2/sites-available/000-default.conf
```
Config server:
```
Listen 8887
<VirtualHost *:8887>
	ServerAdmin webmaster@localhost

	DocumentRoot /path_to_realtime_app/
	<Directory /path_to_realtime_app/>
		Options Indexes FollowSymLinks MultiViews
                AllowOverride All
                Require all granted
	</Directory>
</VirtualHost>
```
- Redis:
```
# sudo apt-get install redis-server
```
- NodeJS:
```
# sudo apt-get install nodejs
```
- Forever:
```
# sudo npm install forever -g
```
- Run App:
```
# cd /path_to_realtime_app
# node js/server.js
```
Goto: http://{IP}:8887

## Demo:
![alt text](http://gyazo.framgia.com/4oo.jpg "Demo app")

