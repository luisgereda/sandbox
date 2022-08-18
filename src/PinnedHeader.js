import { useEffect, useState } from "react";
import {
  useChannelActionContext,
  useChannelStateContext,
} from "stream-chat-react";

const PinnedHeader = () => {
  const { channel } = useChannelStateContext();
  const { jumpToMessage } = useChannelActionContext();
  const [msgs, setMsgs] = useState([]);
  const [message, setMessage] = useState();

  useEffect(() => {
    const func = async () => {
      const pinnedMessages = await channel.getPinnedMessages(
        { limit: 100 },
        { pinned_at: -1 }
      );
      console.log({ pinnedMessages });
      setMsgs(pinnedMessages.messages);
      if (pinnedMessages.messages.length > 0) {
        console.log("setting state", pinnedMessages.messages[0].id);
        setMessage({
          mid: pinnedMessages.messages[0].id,
          text: pinnedMessages.messages[0].text,
        });
      }
      //const totalCount = pinnedMessages?.messages?.length ?? 0;
    };
    func();
  }, []);

  const click = () => {
    console.log("called");
    console.log(msgs, message.mid);
    const pos = msgs.findIndex(({ id }) => id === message.mid);
    const next = (pos + 1) % msgs.length;
    console.log({ pos, next });
    if (pos > -1) {
      setMessage({
        mid: msgs[next].id,
        text: msgs[next].text,
      });
    }
    jumpToMessage(message.mid);
  };
  if (!message) return null;
  console.log(message.text);
  return (
    <button className="pinned" onClick={click}>
      {message.text ? message.text : "IMAGE"}
    </button>
  );
};

export default PinnedHeader;
