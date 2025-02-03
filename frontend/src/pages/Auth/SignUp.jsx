import { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import Button from "../../components/Button";

const Signup = () => {
  return (
    <Layout>
      <div
        className={`
      text-xs text-white/75

      [&_label]:text-sm [&_label]:text-white/70 

      [&_input]:h-9 [&_input]:rounded-md [&_input]:px-3
      [&_input]:bg-white/20 [&_input]:placeholder:text-white/30

      [&_p]:text-xs [&_p]:text-red-500/90
      `}
      >
        <h1 className="my-6 text-2xl font-medium text-center">별에별일</h1>

        <form className="space-y-5 py-6">
          {/* 이메일 */}
          <div className="space-y-2">
            <label>이메일</label>
            <div className="flex items-center space-x-2">
              <input type="email" name="email" placeholder="이메일을 입력해 주세요" className="flex-1" />
              <Button text="확인" type="DEFAULT" className="w-14 h-8" />
            </div>
            <p>validation message</p>
          </div>

          {/* 이름 */}
          <div className="space-y-2">
            <label>이름</label>
            <div className="flex items-center space-x-2">
              <input type="text" name="name" placeholder="이름을 입력해 주세요" className="flex-1" />
              <Button text="확인" type="DEFAULT" className="w-14 h-8" />
            </div>
            <p>validation message</p>
          </div>

          {/* 생년월일 */}
          <div className="space-y-2">
            <label>생년월일</label>
            <input type="date" name="birthDate" className="w-full" />
            <p>validation message</p>
          </div>

          {/* 성별 */}
          <div className="space-y-2">
            <label>성별</label>
            <div className="flex space-x-8">
              <label className="flex items-center">
                <input type="radio" name="gender" value="male" className="mr-2 text-blue-500" />
                <span>남성</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="gender" value="female" className="mr-2 text-blue-500" />
                <span>여성</span>
              </label>
            </div>
            <p>validation message</p>
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <label>비밀번호</label>
            <input type="password" name="password" placeholder="비밀번호를 입력해 주세요" className="w-full" />
            <p>validation message</p>
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-2">
            <label>비밀번호 확인</label>
            <input type="password" name="passwordConfirm" placeholder="비밀번호를 입력해 주세요" className="w-full" />
            <p>validation message</p>
          </div>

          {/* 제출 버튼 */}
          <Button text="확인" type="DEFAULT" className="w-full h-10" />
        </form>
      </div>
    </Layout>
  );
};

export default Signup;
