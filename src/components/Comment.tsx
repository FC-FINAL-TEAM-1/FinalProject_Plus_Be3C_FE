import { css } from '@emotion/react';
import ProfileImage from '@/components/ProfileImage';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';
import useModalStore from '@/stores/useModalStore';
import { parseDateTime } from '@/utils/dateUtils';

interface CommentProps {
  profileImage: string;
  nickname: string;
  date: string;
  content: React.ReactNode;
  isAuthor: boolean;
  handleSetDeleteComment?: () => void;
}

const Comment: React.FC<CommentProps> = ({
  profileImage,
  nickname,
  date,
  content,
  isAuthor,
  handleSetDeleteComment = () => {},
}) => {
  const commentDate = parseDateTime(date);
  const { openModal } = useModalStore();

  return (
    <div css={commentStyle}>
      <div className='top-box'>
        <div className='profile-box'>
          <ProfileImage src={profileImage} alt='profile' size='md' />
          <div className='text-box'>
            <span className='nickname'>{nickname}</span>
            <span className='date'>{`${commentDate.year}. ${commentDate.month}. ${commentDate.day}. ${commentDate.hour}:${commentDate.minute}`}</span>
          </div>
        </div>
        {isAuthor ? (
          <div className='action-box'>
            <a
              onClick={() => {
                handleSetDeleteComment();
                openModal('comment-delete');
              }}
            >
              삭제
            </a>
          </div>
        ) : (
          ''
        )}
      </div>
      <div className='bottom-box'>{content}</div>
    </div>
  );
};

const commentStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 164px;
  padding: 24px;
  gap: 24px;
  border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

  .top-box {
    display: flex;
    justify-content: space-between;

    .profile-box {
      display: flex;
      gap: 16px;
    }
    .text-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 12px;

      .date {
        color: ${COLOR_OPACITY.BLACK_OPACITY50};
        font-size: ${FONT_SIZE.TEXT_SM};
      }
    }
  }

  .action-box {
    display: flex;
    gap: 8px;
    font-size: ${FONT_SIZE.TEXT_SM};

    a {
      cursor: pointer;
      color: ${COLOR.PRIMARY};
    }
  }

  .bottom-box {
    line-height: 24px;
  }
`;

export default Comment;
