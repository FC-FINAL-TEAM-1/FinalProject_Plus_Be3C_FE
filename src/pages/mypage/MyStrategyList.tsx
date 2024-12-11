import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import dayIcon from '@/assets/images/day-icon.png';
import positionIcon from '@/assets/images/position-icon.png';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import Table, { ColumnProps } from '@/components/Table';
import Tag from '@/components/Tag';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useDeleteTraderAddStrategyList,
  useGetTraderAddStrategyList,
} from '@/hooks/useStrategyApi';
import useModalStore from '@/stores/useModalStore';
import { useTableStore } from '@/stores/useTableStore';
import getColorStyleBasedOnValue from '@/utils/tableUtils';
interface MyStrategyListDataProps {
  ranking?: number;
  traderId: number;
  traderNickname: string;
  strategyId: number;
  methodId: number;
  stockList: {
    stockIds: number[];
    stockNames: string[];
    stockIconPath?: string[];
  };
  cycle: string;
  name: string;
  mdd: number;
  smScore: number;
  accumulatedProfitLossRate: number;
  followerCount?: number;
  methodIconPath: string;
  strategy?: any;
}

const PAGE_SIZE = 10;

const CheckModalContent = () => (
  <div css={checkModalStyle}>삭제할 전략을 선택해주세요.</div>
);

const DeleteStrategyModalContent = ({
  strategyIds,
  traderAddStrategyListRefetch,
}: {
  strategyIds: number[];
  traderAddStrategyListRefetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
}) => {
  const { closeModal } = useModalStore();
  const { toggleAllCheckboxes } = useTableStore();

  const { mutate: deleteStrategyMutation } = useDeleteTraderAddStrategyList();

  const handleStrategyDelete = () => {
    deleteStrategyMutation(
      { idList: strategyIds },
      {
        onSuccess: async () => {
          traderAddStrategyListRefetch();
          toggleAllCheckboxes(0);
          closeModal('delete-strategy-modal-01');
        },
        onError: (error: any) => {
          console.error('Strategy deletion failed:', error);
          alert(`삭제에 실패했습니다: ${error.message}`);
        },
      }
    );
  };

  return (
    <div css={modalStyle}>
      해당전략의 데이터를
      <br />
      삭제하시겠습니까?
      <div className='btn-area'>
        <Button
          label='아니오'
          border={true}
          width={120}
          handleClick={() => closeModal('delete-strategy-modal-01')}
        />
        <Button label='예' width={120} handleClick={handleStrategyDelete} />
      </div>
    </div>
  );
};

const MyStrategyList = () => {
  const navigate = useNavigate();
  const deleteModal01 = useModalStore();
  const checkModal01 = useModalStore();

  const [tableData, setTableData] = useState<MyStrategyListDataProps[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [totalElement, setTotalElement] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const checkedItems = useTableStore((state) => state.checkedItems);
  const toggleCheckbox = useTableStore((state) => state.toggleCheckbox);
  const toggleAllCheckboxes = useTableStore(
    (state) => state.toggleAllCheckboxes
  );

  const {
    data: traderAddStrategyListData,
    refetch: traderAddStrategyListRefetch,
  } = useGetTraderAddStrategyList(currentPage);

  const traderName = traderAddStrategyListData?.data?.traderNickname;

  useEffect(() => {
    if (traderAddStrategyListData) {
      const data = traderAddStrategyListData?.data?.strategyList;
      setTotalPage(data?.totalPages);
      setTableData(data?.content);
      setPageSize(data?.pageSize);
      setTotalElement(data?.totalElement);
    }
  }, [traderAddStrategyListData]);

  const getSelectedStrategyIds = () => {
    const selectedStrategyIds = checkedItems
      .map((index) => tableData[index]?.strategyId)
      .filter((strategyId) => strategyId !== undefined);

    return selectedStrategyIds;
  };

  const strategyIds = getSelectedStrategyIds();

  const handleDeleteInterestStrategy = () => {
    if (checkedItems?.length > 0) {
      deleteModal01.openModal('delete-strategy-modal-01', 360);
    } else {
      checkModal01.openModal('check-modal-01', 336);
    }
  };

  const columns: ColumnProps<MyStrategyListDataProps>[] = [
    {
      key: 'ranking',
      header: '순서',
      render: (_, __, rowIndex: number) =>
        rowIndex + 1 + currentPage * pageSize,
    },
    {
      key: 'traderNickname',
      header: '트레이더',
      render: () => <div>{traderName}</div>,
    },
    {
      key: 'name',
      header: '전략명',
      render: (_, item) => (
        <div css={tagStyle}>
          <div className='tag'>
            <Tag src={item?.methodIconPath || ''} alt='tag' />
            <Tag src={item?.cycle === 'D' ? dayIcon : positionIcon} />
            {item?.stockList?.stockIconPath &&
              item?.stockList?.stockIconPath.map(
                (stock: string, index: number) => (
                  <Tag key={index} src={stock} alt='tag' />
                )
              )}
          </div>
          <span>{item.name}</span>
        </div>
      ),
    },
    {
      key: 'accumulatedProfitLossRate',
      header: '누적 손익률',
      render: (_, item) => {
        const itemValue = item.accumulatedProfitLossRate;

        const { text, style } = getColorStyleBasedOnValue(itemValue);

        return (
          <div css={fontStyle} style={style}>
            {text}
          </div>
        );
      },
    },
    {
      key: 'mdd',
      header: 'MDD',
      render: (_, item) => {
        const itemValue = item.mdd;

        const { text, style } = getColorStyleBasedOnValue(itemValue);

        return (
          <div css={fontStyle} style={style}>
            {text}
          </div>
        );
      },
    },
    {
      key: 'smScore',
      header: 'SM Score',
      render: (_, item) => {
        const itemValue = item.smScore;

        const { text, style } = getColorStyleBasedOnValue(itemValue);

        return (
          <div css={fontStyle} style={style}>
            {text}
          </div>
        );
      },
    },
    {
      key: 'strategy',
      header: '상태',
      render: (_, item) => (
        <div css={buttonStyle}>
          <Button
            label='전략 수정'
            shape='round'
            size='xs'
            width={80}
            handleClick={() => {
              navigate(PATH.MYPAGE_STRATEGIES_EDIT(String(item.strategyId)));
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div css={strategyListWrapperStyle}>
      <div className='table-info'>
        <h6 className='info-text'>
          총 <strong>{totalElement}개</strong>의 리스트
        </h6>
        <div className='btn-area'>
          <Button
            label='삭제'
            width={80}
            color='black'
            handleClick={handleDeleteInterestStrategy}
          />
        </div>
      </div>
      <Table
        data={tableData}
        columns={columns}
        hasCheckbox={true}
        checkedItems={checkedItems}
        handleCheckboxChange={toggleCheckbox}
        handleHeaderCheckboxChange={() => toggleAllCheckboxes(tableData.length)}
      />
      {totalElement > 0 ? (
        <Pagination
          totalPage={totalPage}
          currentPage={currentPage}
          handlePageChange={setCurrentPage}
        />
      ) : (
        <div css={emptyContents}>
          <span>등록된 전략이 없습니다. 전략을 등록해보세요.</span>
          <Button
            label='전략 등록하기'
            border={true}
            width={100}
            size='sm'
            handleClick={() => {
              navigate(PATH.STRATEGIES_ADD);
            }}
          />
        </div>
      )}

      <Modal
        content={
          <DeleteStrategyModalContent
            strategyIds={strategyIds as number[]}
            traderAddStrategyListRefetch={traderAddStrategyListRefetch}
          />
        }
        id='delete-strategy-modal-01'
      />
      <Modal content={<CheckModalContent />} id='check-modal-01' />
    </div>
  );
};

const strategyListWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 105px;

  table > thead > tr > th {
    &:nth-of-type(1) {
      width: 80px;
      display: flex;
      justify-content: center;
    }
    &:nth-of-type(2) {
      width: 80px;
    }
    &:nth-of-type(3) {
      width: 202px;
    }
    &:nth-of-type(4) {
      width: 280px;
    }
    &:nth-of-type(5) {
      width: 196px;
    }
    &:nth-of-type(6) {
      width: 120px;
    }
    &:nth-of-type(7) {
      width: 120px;
    }
    &:nth-of-type(8) {
      width: 120px;
    }
  }

  table > tbody > tr > td {
    &:nth-of-type(1) div {
      display: flex;
      justify-content: center;
    }
  }

  .table-info {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .info-text {
      font-weight: ${FONT_WEIGHT.REGULAR};

      strong {
        font-weight: ${FONT_WEIGHT.BOLD};
      }
    }

    .btn-area {
      display: flex;
      gap: 16px;
    }
  }
`;

const emptyContents = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  border-radius: 4px;
  line-height: 160%;
  text-align: center;
`;

const buttonStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  button:nth-of-type(1) {
    background: none;
    border: 1px solid ${COLOR.POINT};
    color: ${COLOR.POINT};

    :hover {
      background: ${COLOR_OPACITY.POINT_OPACITY10};
      transition: 0.3s;
    }
  }

  button:nth-of-type(2) {
    background: none;
    border: 1px solid ${COLOR.PRIMARY};
    color: ${COLOR.PRIMARY};

    :hover {
      background: ${COLOR_OPACITY.PRIMARY_OPACITY10};
      transition: 0.3s;
    }
  }
`;

const tagStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  .tag {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
  }
`;

const modalStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  line-height: 160%;
  text-align: center;
  margin-top: 8px;

  .btn-area {
    display: flex;
    gap: 16px;
  }

  .delete-error-msg {
    color: ${COLOR.ERROR_RED};
    font-size: ${FONT_SIZE.TEXT_SM};
  }
`;

const fontStyle = css`
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const checkModalStyle = css`
  display: flex;
  margin-top: 8px;
  gap: 24px;
  padding: 24px 0;
`;

export default MyStrategyList;
