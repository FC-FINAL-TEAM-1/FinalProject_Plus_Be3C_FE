import { css } from '@emotion/react';

const SignUp = () => (
  <div css={AWrapperStyle}>
    <h1 css={TitleStyle}>회원가입</h1>
    <div css={ContentsDivStyle}>
      <h2>
        <span>시스메틱</span>에 오신 것을 환영합니다.
      </h2>
      <p>
        시스메틱 홈페이지의 회원이 되시면 전략탐색, 전략등록 등 다양한 서비스를
        이용하실 수 있습니다.
      </p>
      <p>투자자 가입으로 가입 시, 관심있는 전략만 별도로 관리할 수 있습니다.</p>
    </div>
    <div css={ButtonDivStyle}>
      <button>투자자 가입</button>
      <button>트레이더 가입</button>
    </div>
  </div>
);

const AWrapperStyle = css`
  width: 100%;
  height: calc(100vh - calc(144px + 309px));
  max-width: 1200px;
  padding: 0 10px;
  margin: 0 auto;
  color: #000;
  letter-spacing: -0.4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TitleStyle = css`
  width: 82px;
  height: 24px;
  font-weight: 700;
  font-size: 24px;
  line-height: 24px;
  margin-bottom: 38px;
`;

const ContentsDivStyle = css`
  border: 1px solid #1261c44d;
  padding: 30px 26px;

  h2 {
    font-size: 20px;
    margin-bottom: 11px;
  }

  h2 > span {
    color: #1261c4;
    font-weight: 700;
  }

  p {
    line-height: 160%;
  }
`;

const ButtonDivStyle = css`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  gap: 20px;

  button {
    width: 578px;
    height: 136px;
    font-size: 32px;
    color: #fff;
    font-weight: 700;
    line-height: 160%;
    line-spacing: -0.64px;
    background-color: #1261c4;
    // background-color: #0B3C79;
    cursor: pointer;
  }
`;

export default SignUp;
