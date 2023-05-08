import Header from 'Components/Header/Header';
import './InformationDetail.css';

const InformationDetail = () => {
  return (
    <>
      <Header />
      <div>
        등록 정보 조회 / 등록 정보
      </div>
      <h1>등록 정보</h1>
      <span>사용법 보기</span>
      <div
        className="information_detail_section"
      >
        사용자 아이디
        abcd2324
      </div>
      <div>
        <div>인증 장치</div>
        <div>

        </div>
        <div>

        </div>
        <div>

        </div>
      </div>
      <div>
        바이패스
      </div>
      <div>
        <button>저장</button>
        <button>삭제</button>
      </div>
    </>
  )
}

export default InformationDetail;