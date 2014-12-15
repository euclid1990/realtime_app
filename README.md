Realtime Chat Application
========

## Websocket là gì
WebSoket là công nghệ hỗ trợ giao tiếp hai chiều giữa client và server bằng cách sử dụng một TCP socket để tạo một kết nối hiệu quả và ít tốn kém. Mặc dù được thiết kế để chuyên sử dụng cho các ứng dụng web, lập trình viên vẫn có thể đưa chúng vào bất kì loại ứng dụng nào.
##### Socket.IO được tạo ra là để tận dụng websocket của html5 của các trình duyệt mới, để tạo ra các ứng dụng web thời gian thực. 

## Ứng dụng chat sử dụng NodeJS - Redis & PHP
#### Nguyên tắc hoạt động:
- Client kết nối tới Server thông qua websocket
- Với mỗi client sẽ subcribe 1 chanel tương ứng trên redis storage
- Khi có bất kỳ thay đổi nào được ghi (publish) trên chanel redis tương ứng của user, nội dung message sẽ được emit ngược lại client.
- Với public notification: emit toàn bộ clients đang connect (Khi người dùng gửi message)
- Với private notification: emit client mong muốn nhận notify (Khi người dùng poke nhau)

## Source Code:
- Hiển thị giao diện người dùng và khởi tạo Session:
[**index.php**](index.php)
- Xử lý hiển thị message trên client, kết nối đến server và nhận dữ liệu từ server:
[**client.js**](js/client.js)
- Xử lý khởi tạo socket kết nối với client, thực hiện đọc ghi dữ liệu trên redis và thông báo tới clients:
[**server.js**](js/server.js)

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
# forever start js/server.js
```
Goto: http://{Your_IP}:8887

## Demo:
![alt text](http://gyazo.framgia.com/4oo.jpg "Demo app")

