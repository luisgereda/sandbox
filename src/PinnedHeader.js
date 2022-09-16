import { useEffect, useState, useCallback, useRef } from "react";
import {
  useChannelActionContext,
  useChannelStateContext,
} from "stream-chat-react";

const useDebounce = (functionToDebounce, timeout) => {
  const timeoutReference = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutReference.current !== null) {
        clearTimeout(timeoutReference.current);
        timeoutReference.current = null;
      }

      timeoutReference.current = setTimeout(
        functionToDebounce,
        timeout,
        ...args
      );
    },
    [functionToDebounce, timeout]
  );
};

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

  const debouncedJumpToMessage = useDebounce(jumpToMessage, 300);

  useEffect(() => {
    if (typeof message?.mid !== "string") return;

    debouncedJumpToMessage(message.mid);
  }, [message?.mid]);

  const click = useCallback(
    () =>
      setMessage((message) => {
        const pos = msgs.findIndex(({ id }) => id === message.mid);
        const next = (pos + 1) % msgs.length;

        if (pos < 0) return message;

        return {
          mid: msgs[next].id,
          text: msgs[next].text,
        };
      }),
    [msgs]
  );

  if (!message) return null;

  return (
    <button className="pinned" onClick={click}>
      {message.text ? message.text : "IMAGE"}
    </button>
  );
};

export default PinnedHeader;
