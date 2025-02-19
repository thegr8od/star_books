import React, { useEffect, useState } from "react";
import { Mic, Group, Favorite, Close, Person, FavoriteBorder, ThumbUp, EmojiEmotions } from "@mui/icons-material";

const UserState = ({ nickname, profileImage, viewers, likes, onEndBroadcast }) => (
  <div className="flex justify-between my-5">
    <div className="flex space-x-2">
      <div className="size-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
        {profileImage ? (
          <img src={profileImage} alt={nickname} className="size-full object-cover" />
        ) : (
          <Person className="size-6 text-gray-400" />
        )}
      </div>
      <div>
        <p className="text-white">{nickname}</p>
        <div className="flex space-x-3 mt-1">
          <div className="flex items-center space-x-1 text-gray-400 text-sm">
            <Group />
            <span>{viewers}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400 text-sm">
            <Favorite fontSize="small" />
            <span>{likes}</span>
          </div>
        </div>
      </div>
    </div>
    <button 
      className="size-8 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
      onClick={onEndBroadcast} // X 버튼 클릭 시 onEndBroadcast 호출
    >
      <Close className="size-4 text-gray-300/60" />
    </button>
  </div>
);

const LiveState = ({ currentTime }) => (
  <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-500/20 text-indigo-300/80">
    <div className="flex items-center space-x-3 text-indigo-300/80">
      <div className="size-8 rounded-xl bg-indigo-500/30 flex items-center justify-center">
        <Mic />
      </div>
      <span className="text-sm">On Air</span>
    </div>
    <div className="text-lg font-bold tabular-nums">{currentTime}</div>
  </div>
);

const PlanetDisplay = () => (
  <div className="flex-1 flex flex-col items-center justify-center relative">
    <div className="absolute size-64 rounded-full border-2 border-purple-500/50 translate-y-12"></div>
    <div className="absolute size-48 rounded-full overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900"></div>
    <div className="absolute size-52 rounded-full bg-purple-400/20 animate-pulse delay-1000"></div>
    <div className="absolute size-64 rounded-full bg-purple-400/20 animate-pulse delay-500"></div>
    <div className="absolute size-80 rounded-full bg-blue-400/10 animate-pulse"></div>
  </div>
);

const RadioShow = ({ title = "라디오? 레디오!", nickname = "닉네임", profileImage = "", viewers = 127, likes = 52, onEndBroadcast }) => {
  const [currentTime, setCurrentTime] = useState("00:00:00");
  const [likeCount, setLikeCount] = useState(likes);
  const [emojis, setEmojis] = useState([]);
  const { room, role } = useRoomContext();

  useEffect(() => {
    if (role === "host") {
      room.localParticipant.setMicrophoneEnabled(true);
    } else {
      room.localParticipant.setMicrophoneEnabled(false);
    }
  }, [room, role]);

  useEffect(() => {
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const hours = Math.floor(seconds / 3600).toString().padStart(2, "0");
      const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
      const secs = (seconds % 60).toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addEmoji = (icon) => {
    const newEmoji = {
      id: Date.now(),
      icon,
      left: Math.random() * 90 + 5,
      bottom: 0,
    };
    setEmojis((prev) => [...prev, newEmoji]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setEmojis((prev) => prev.filter((emoji) => Date.now() - emoji.id < 3000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <UserState nickname={nickname} profileImage={profileImage} viewers={viewers} likes={likeCount} onEndBroadcast={onEndBroadcast} />
      <LiveState currentTime={currentTime} />
      <PlanetDisplay />
  
      <h2 className="text-white text-center">{title}</h2>
      <img src="/images/radio1.png" alt="character" className="h-11 mx-auto" />
      <img src="/images/horizon.png" alt="horizon" className="w-full" />

      <div className="fixed bottom-10 right-10 flex space-x-4">
        <button onClick={() => addEmoji(<Favorite fontSize="large" className="text-pink-500" />)} className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full shadow-lg">
          <FavoriteBorder fontSize="large" />
        </button>
        <button onClick={() => addEmoji(<ThumbUp fontSize="large" className="text-blue-500" />)} className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg">
          <ThumbUp fontSize="large" />
        </button>
        <button onClick={() => addEmoji(<EmojiEmotions fontSize="large" className="text-yellow-500" />)} className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-full shadow-lg">
          <EmojiEmotions fontSize="large" />
        </button>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-full pointer-events-none overflow-visible">
        {emojis.map((emoji) => (
          <div
            key={emoji.id}
            className="absolute animate-floatUp text-2xl"
            style={{
              left: `${emoji.left}%`,
              bottom: 0,
            }}
          >
            {emoji.icon}
          </div>
        ))}
      </div>
      <AudioComponent track={track.trackPublication.audioTrack} participantIdentity={track.participantIdentity} />
    </div>
  );
};

export default RadioShow;
