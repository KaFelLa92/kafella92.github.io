# 8장: Spring과 WebSocket

`dongjinWeb2`에서 경험했던 WebSocket을 더 깊이 이해합니다. 실시간 채팅, 알림 등 양방향 통신이 필요한 기능을 구현하는 방법을 복습하고, Stomp 프로토콜을 사용하여 더 구조화된 메시징을 구현해봅니다.

---

## 1. 핵심 개념

- **WebSocket**: 단일 TCP 연결을 통해 서버와 클라이언트 간의 전이중(full-duplex) 통신을 제공하는 프로토콜입니다. HTTP와 달리 연결이 계속 유지됩니다.
- **`TextWebSocketHandler`**: 텍스트 기반의 WebSocket 메시지를 처리하기 위한 Spring의 기본 핸들러입니다.
- **`WebSocketSession`**: WebSocket 연결이 수립된 클라이언트 하나하나를 나타내는 객체입니다.
- **STOMP (Simple Text Oriented Messaging Protocol)**: WebSocket 위에서 동작하는 메시징 프로토콜입니다. 목적지(destination), 구독(subscribe), 메시지 발행(publish) 등의 개념을 제공하여 더 구조화된 통신을 가능하게 합니다.

---

## 2. 예제를 통한 복습

`dongjinWeb2/src/main/java/example/day03/ChatSocketHandler.java`는 여러 채팅방을 관리하는 로직의 핵심을 보여줍니다.

```java
@Component
public class ChatSocketHandler extends TextWebSocketHandler {

    // key: 방번호, value: 해당 방에 접속한 클라이언트 세션 목록
    private static final Map<String, List<WebSocketSession>> list = new Hashtable<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // JSON 문자열을 Map으로 변환
        Map<String, String> msg = objectMapper.readValue(message.getPayload(), Map.class);

        // 메시지 타입이 'join'이면 접속자 목록에 추가
        if (msg.get("type").equals("join")) {
            String room = msg.get("room");
            if (!list.containsKey(room)) {
                list.put(room, new Vector<>());
            }
            list.get(room).add(session);
            // ... 입장 알림 메시지 전송 ...
        }
        // 메시지 타입이 'msg'이면 같은 방의 모든 클라이언트에게 메시지 전송
        else if (msg.get("type").equals("msg")) {
            String room = (String) session.getAttributes().get("room");
            for (WebSocketSession client : list.get(room)) {
                client.sendMessage(message);
            }
        }
    }
}
```

---

## 3. 직접 풀 문제

1. 현재 채팅방에 몇 명의 사용자가 있는지 클라이언트에게 알려주는 기능을 추가해보세요. 사용자가 입장하거나 퇴장할 때마다, 해당 방의 모든 클라이언트에게 `{"type":"count", "count":5}` 와 같은 형식의 메시지를 보내도록 `ChatSocketHandler`를 수정하세요.

2. STOMP를 사용하도록 프로젝트를 전환해보세요. `@EnableWebSocketMessageBroker`와 `@MessageMapping` 어노테이션을 사용하여 채팅 기능을 재구현해보세요. `/pub/chat/message`로 메시지를 발행(publish)하면, `/sub/chat/room/{roomId}`를 구독(subscribe)하고 있는 클라이언트들에게 메시지가 전달되도록 만들어보세요.
