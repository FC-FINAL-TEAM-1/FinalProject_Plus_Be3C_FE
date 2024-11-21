import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import TagTest from '@/assets/images/test-tag.jpg';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import adminMethods from '@/mocks/adminMethods.json';
import { useTableStore } from '@/stores/useTableStore';

interface AdminMethodsDataProps {
  no: number;
  type: string;
}

const PAGE_SIZE = 10;

const AdminMethods = () => {
  //테이블 관련
  const [curPage, setCurPage] = useState(0);
  const [data, setData] = useState<AdminMethodsDataProps[]>([]);
  //페이지네이션 관련
  const [totalPage, setTotalPage] = useState(0);
  const getPaginatedData = (page: number) => {
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return data.slice(startIndex, endIndex);
  };

  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );

  const paginatedData = getPaginatedData(curPage);
  const columns = [
    {
      key: 'no' as keyof AdminMethodsDataProps,
      header: '순서',
    },
    {
      key: 'type' as keyof AdminMethodsDataProps,
      header: '상품유형',
    },
    {
      key: 'icon' as keyof AdminMethodsDataProps,
      header: '아이콘',
      render: (value: string | number) => (
        <div css={tagStyle}>
          <div>
            <Tag src={TagTest} alt='tag' />
          </div>
          {value}
        </div>
      ),
    },
    {
      key: 'state' as keyof AdminMethodsDataProps,
      header: '상태',
      render: () => (
        <Button
          label='방식수정'
          shape='round'
          size='xs'
          color='primary'
          border={true}
          width={80}
          handleClick={() => {}}
        />
      ),
    },
  ];

  useEffect(() => {
    // 순서를 기준으로
    const sortedData = [...adminMethods].sort((a, b) => b.no - a.no);
    const arrangedData = sortedData.map((item, index) => ({
      ...item,
      no: index + 1,
    }));
    setData(arrangedData);

    const pages = Math.ceil(arrangedData.length / PAGE_SIZE);
    setTotalPage(pages);
  }, []);

  return (
    <div css={methodsWrapperStyle}>
      <div css={methodsInfoStyle}>
        <p>
          총 <span>15개</span>의 매매방식이 있습니다.
        </p>
        <div className='manage-btn'>
          <Button
            width={80}
            label='등록'
            handleClick={() => console.log('등록')}
          />
          <Button
            width={80}
            color='black'
            label='삭제'
            handleClick={() => console.log('삭제')}
          />
        </div>
      </div>
      <div css={methodsTableStyle}>
        <Table
          data={paginatedData}
          columns={columns}
          hasCheckbox={true}
          checkedItems={checkedItems}
          handleCheckboxChange={toggleCheckbox}
          handleHeaderCheckboxChange={() =>
            toggleAllCheckboxes(paginatedData.length)
          }
        />
      </div>
      <div css={methodsPaginationStyle}>
        <Pagination
          totalPage={totalPage}
          currentPage={curPage}
          handlePageChange={setCurPage}
        />
      </div>
    </div>
  );
};

const methodsWrapperStyle = css`
  display: flex;
  flex-direction: column;
  margin: 0 auto 96px;
  padding: 0 10px;
  max-width: 1200px;
`;

const methodsInfoStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${FONT_SIZE.TITLE_XS};
  letter-spacing: -0.4px;
  margin-bottom: 24px;

  p > span {
    font-weight: ${FONT_WEIGHT.BOLD};
  }

  .manage-btn {
    display: flex;
    gap: 16px;
  }
`;

const methodsTableStyle = css`
  display: flex;
  flex-direction: column;
  gap: 29px;

  table > thead > tr > th {
    padding: 16px 0;

    div {
      align-items: center;
      justify-content: center;
    }
  }

  table > tbody > tr > td {
    padding: 16px 0;

    div {
      align-items: center;
      justify-content: center;
    }

    &:nth-of-type(1) {
      width: 60px;
    }
    &:nth-of-type(2) {
      width: 80px;
    }
    &:nth-of-type(3) {
      width: 460px;
    }
    &:nth-of-type(4) {
      width: 460px;
    }
    &:nth-of-type(5) {
      width: 120px;
    }
  }
`;

const methodsPaginationStyle = css`
  margin-top: 32px;
`;

const tagStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
`;

export default AdminMethods;
