import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
  VirtualizedMessageList,
} from "stream-chat-react";
import "@stream-io/stream-chat-css/dist/css/index.css";
import PinnedHeader from "./PinnedHeader";

const filters = { members: { $in: ["1158316"] } };
const options = { state: true, presence: true, limit: 10 };
const sort = { last_message_at: -1 };

const App = () => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const newClient = new StreamChat("5ej6fmrv2xj2");

    const handleConnectionChange = ({ online = false }) => {
      if (!online) return console.log("connection lost");
      setClient(newClient);
    };

    newClient.on("connection.changed", handleConnectionChange);

    newClient.connectUser(
      {
        id: "1158316",
        name: "demouser",
      },
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTE1ODMxNiJ9.-jeKQOkWlyk4dREzV-CufUfCMea1XaJBfeqV2gwT0-g"
    );

    return () => {
      newClient.off("connection.changed", handleConnectionChange);
      newClient.disconnectUser().then(() => console.log("connection closed"));
    };
  }, []);

  if (!client) return null;

  return (
    <Chat client={client}>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel>
        <Window>
          <ChannelHeader />
          <PinnedHeader />
          <VirtualizedMessageList
            messageLimit={50}
            //disableDateSeparator={false}
          />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default App;
