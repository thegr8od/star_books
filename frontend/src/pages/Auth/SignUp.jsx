import { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import Button from "../../components/Button";

const Signup = () => {
  return (
    <Layout>
      <div className="text-white">
        <h1>회원가입</h1>

        <form>
          {/* 이메일 */}
          <div>
            <label>이메일</label>
            <div>
              <input type="email" name="email" placeholder="이메일을 입력해 주세요" />
              <Button text="확인" type="DEFAULT" />
            </div>
            <p>validation message</p>
          </div>

          {/* 이름 */}
          <div>
            <label>이름</label>
            <div>
              <input type="text" name="name" placeholder="이름을 입력해 주세요" />
              <Button text="확인" type="DEFAULT" />
            </div>
            <p>validation message</p>
          </div>

          {/* 생년월일 */}
          <div>
            <label>생년월일</label>
            <input type="date" name="birthDate" />
            <p>validation message</p>
          </div>

          {/* 성별 */}
          <div>
            <label>성별</label>
            <div>
              <label>
                <input type="radio" name="gender" value="male" />
                <span>남성</span>
              </label>
              <label>
                <input type="radio" name="gender" value="female" />
                <span>여성</span>
              </label>
            </div>
            <p>validation message</p>
          </div>

          {/* 비밀번호 */}
          <div>
            <label>비밀번호</label>
            <input type="password" name="password" placeholder="비밀번호를 입력해 주세요" />
            <p>validation message</p>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label>비밀번호 확인</label>
            <input type="password" name="passwordConfirm" placeholder="비밀번호를 입력해 주세요" />
            <p>validation message</p>
          </div>

          {/* 제출 버튼 */}
          <Button text="회원가입입" type="DEFAULT" />
        </form>
      </div>
    </Layout>
  );
};

export default Signup;
