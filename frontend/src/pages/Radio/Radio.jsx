import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import RadioList from "./RadioList";
import RadioShow from "./RadioShow";
import { Room, RoomEvent, createLocalAudioTrack } from "livekit-client";
import { useSelector } from "react-redux";
import { selectUserNickname } from "../../store/userSlice";

const Radio = () => {
  const [showList, setShowList] = useState(true);
  const [room, setRoom] = useState(null);
  const [role, setRole] = useState(null);
  const [remoteTracks, setRemoteTracks] = useState([]);
  const nickname = useSelector(selectUserNickname);  // Redux에서 nickname 가져오기
  const APPLICATION_SERVER_URL = "https://starbooks.site/api/radio/";
  const LIVEKIT_URL = "wss://starbooks.site:7443";

  async function updateParticipantCount(roomName, action) {
    await fetch(APPLICATION_SERVER_URL + "updateParticipants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName, action }),
    });
  }

  async function joinRoom(roomToJoin, selectedRole) {
    const room = new Room();
    setRoom(room);

    try {
      let token = localStorage.getItem(`token_${roomToJoin}_${nickname}`);

      if (!token) {
        const tokenResponse = await fetch(APPLICATION_SERVER_URL + "token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName: roomToJoin, participantName: nickname }),
        });
        const tokenData = await tokenResponse.json();
        token = tokenData.token;
        selectedRole = selectedRole || tokenData.role;
        localStorage.setItem(`token_${roomToJoin}_${nickname}`, token ?? "");
        localStorage.setItem(`role_${roomToJoin}_${nickname}`, selectedRole);
      } else {
        selectedRole = selectedRole || localStorage.getItem(`role_${roomToJoin}_${nickname}`) || "guest";
      }

      setRole(selectedRole);
      await room.connect(LIVEKIT_URL, token ?? "");
      await updateParticipantCount(roomToJoin, "join");

      if (selectedRole === "host") {
        const audioTrack = await createLocalAudioTrack({});
        await room.localParticipant.publishTrack(audioTrack);
      } else if (selectedRole === "guest") {
        // guest는 오디오 구독만
        room.participants.forEach((participant) => {
          participant.tracks.forEach((publication) => {
            if (publication.track.kind === "audio") {
              publication.setSubscribed(true);
            }
          });
        });
      }

      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === "audio") {
          track.setMuted(false);
          setRemoteTracks((prev) => [...prev, track]);
        }
      });

      setShowList(false);
    } catch (error) {
      console.log("Error joining room:", error.message);
      await leaveRoom();
    }
  }

  async function leaveRoom() {
    if (room) {
      await updateParticipantCount(room.name, "leave"); // roomName 대신 room.name 사용
      await room.disconnect();
    }
    setRoom(null);
    setRemoteTracks([]);
    setShowList(true); // 방송 종료 후 목록 화면으로 전환
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] p-4">
        <div className="h-[calc(100vh-8rem)] overflow-y-auto">
          {showList ? <RadioList onJoinRoom={(name, role) => joinRoom(name, role)} /> : <RadioShow onEndBroadcast={leaveRoom} />}
        </div>
      </div>
    </Layout>
  );
};

export default Radio;
