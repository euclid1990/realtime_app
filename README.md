Realtime Chat Application

## Ứng dụng chat sử dụng NodeJS - Redis & PHP
#### Nguyên tắc hoạt động:
- Client kết nối tới Server thông qua websocket
- Với mỗi client sẽ subcribe 1 chanel tương ứng trên redis storage
- Khi có bất kỳ thay đổi nào được ghi (publish) trên chanel redis tương ứng của user, nội dung message sẽ được emit ngược lại client.
- Với public notification: emit toàn bộ clients đang connect (Khi người dùng gửi message)
- Với private notification: emit client mong muốn nhận notify (Khi người dùng poke nhau)

## Demo
![alt text](http://gyazo.framgia.com/4oo.jpg "Demo app")

