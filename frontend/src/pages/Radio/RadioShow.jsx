import React from "react";
import { Mic, Group, Favorite, Close, Person } from "@mui/icons-material";
import Layout from "../../components/Layout";

const UserState = ({ nickname, profileImage, viewers, likes }) => (
  <div className="flex justify-between my-5">
    <div className="flex space-x-2">
      <div className="size-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">{profileImage ? <img src={profileImage} alt={nickname} className="size-full object-cover" /> : <Person className="size-6 text-gray-400" />}</div>
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
    <button className="size-8 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-all border border-white/10">
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

const RadioShow = ({ currentTime = "01:17:59", title = "라디오? 레디오!", nickname = "닉네임", profileImage = "", viewers = 127, likes = 52 }) => {
  return (
    <>
      <div className="flex flex-col h-full relative">
        <UserState nickname={nickname} profileImage={profileImage} viewers={viewers} likes={likes} />
        <LiveState currentTime={currentTime} />
        <PlanetDisplay />
        <h2 className="text-white text-center">{title}</h2>
        <img src="/images/radio1.png" alt="character" className="h-11 mx-auto" />
        <img src="/images/horizon.png" alt="horizon" className="w-full" />
      </div>
    </>
  );
};

export default RadioShow;
