import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@/components/Checkbox';
import IconButton from '@/components/IconButton';
import RadioButton from '@/components/RadioButton';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { useGetMethodAndStock } from '@/hooks/useStrategyApi';
import { FiltersProps, AlgorithmFilters } from '@/hooks/useStrategyFilters';
import Tooltip from './Tooltip';

interface FilterOptionProps {
  value: string;
  label: string;
  tooltip?: string;
}

interface FilterProps {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range';
  options?: FilterOptionProps[];
}

interface FilterInputProps {
  filter: FilterProps;
  currentValue: string | string[] | [number, number] | undefined;
  onChange: (id: string, value: string | string[] | [number, number]) => void;
}

interface StrategyFilterProps {
  tabIndex: number;
  currentFilters: FiltersProps | AlgorithmFilters;
  onFilterChange: (
    id: string,
    value: string | string[] | [number, number]
  ) => void;
}

export const TAB_FILTERS: Record<number, FilterProps[]> = {
  0: [
    {
      id: 'methods',
      label: '매매방식',
      type: 'checkbox',
      options: [],
    },
    {
      id: 'cycle',
      label: '주기',
      type: 'checkbox',
      options: [
        { value: 'D', label: '데이' },
        { value: 'P', label: '포지션' },
      ],
    },
    {
      id: 'stockNames',
      label: '운용종목',
      type: 'checkbox',
      options: [],
    },
    {
      id: 'period',
      label: '운용기간',
      type: 'radio',
      options: [
        { value: 'ALL', label: '전체' },
        { value: 'LESS_THAN_YEAR', label: '1년 이하' },
        { value: 'ONE_TO_TWO_YEAR', label: '1년 ~ 2년' },
        { value: 'TWO_TO_THREE_YEAR', label: '2년 ~ 3년' },
        { value: 'THREE_YEAR_MORE', label: '3년 이상' },
      ],
    },
    {
      id: 'accumProfitLossRate',
      label: '누적 손익률',
      type: 'range',
      options: [],
    },
  ],
  1: [
    {
      id: 'algorithm',
      label: '알고리즘',
      type: 'radio',
      options: [
        {
          value: 'EFFICIENCY',
          label: '효율형 전략',
          tooltip: '누적수익/MDD 큰 값으로 정렬',
        },
        {
          value: 'OFFENSIVE',
          label: '공격형 전략',
          tooltip: '누적수익/(1-승률) 큰 값으로 정렬',
        },
        {
          value: 'DEFENSIVE',
          label: '방어형 전략',
          tooltip: '(MDD순위 + 표준편차순위 + 승률순위) / 3',
        },
      ],
    },
  ],
};

const FilterInput = ({ filter, currentValue, onChange }: FilterInputProps) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');

  useEffect(() => {
    if (Array.isArray(currentValue)) {
      setRangeStart(currentValue[0]?.toString() || '');
      setRangeEnd(currentValue[1]?.toString() || '');
    }
  }, [currentValue]);

  switch (filter.type) {
    case 'checkbox': {
      const selectedValues: string[] = currentValue
        ? (currentValue as string[])
        : [];

      return (
        <div css={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {filter.options?.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={selectedValues.includes(option.value)}
              handleChange={(checked) => {
                const updatedValues = checked
                  ? [...selectedValues, option.value]
                  : selectedValues.filter((v) => v !== option.value);
                onChange(filter.id, updatedValues);
              }}
            />
          ))}
        </div>
      );
    }

    case 'radio': {
      const radioValue = currentValue as string;

      return (
        <>
          {(filter.options || []).map((option) => (
            <div css={radioStyle} key={option.value}>
              <RadioButton
                options={[option]}
                name={filter.id}
                selected={radioValue || filter.options?.[0]?.value || ''}
                handleChange={(value) => onChange(filter.id, value)}
              />
              {option.tooltip && (
                <Tooltip
                  text={option.tooltip || ''}
                  width={
                    option.value === 'EFFICIENCY'
                      ? 180
                      : option.value === 'OFFENSIVE'
                        ? 190
                        : 240
                  }
                >
                  <ErrorOutlineIcon />
                </Tooltip>
              )}
            </div>
          ))}
        </>
      );
    }

    case 'range': {
      const handleRangeChange =
        (type: 'start' | 'end') => (e: React.ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (value !== '' && !/^[-]?\d*$/.test(value)) return;
          type === 'start' ? setRangeStart(value) : setRangeEnd(value);
        };

      const handleSubmit = () => {
        const startValue = rangeStart === '' ? '' : rangeStart.trim();
        const endValue = rangeEnd === '' ? '' : rangeEnd.trim();

        if (startValue === '' && endValue === '') {
          setErrorMessage('범위를 입력해주세요.');
          return;
        }

        if (
          startValue !== '' &&
          endValue !== '' &&
          parseInt(startValue, 10) >= parseInt(endValue, 10)
        ) {
          setErrorMessage('최소값이 최대값보다 작아야 합니다.');
          return;
        }

        if (
          (startValue !== '' &&
            (parseInt(startValue, 10) < -100 ||
              parseInt(startValue, 10) > 100)) ||
          (endValue !== '' &&
            (parseInt(endValue, 10) < -100 || parseInt(endValue, 10) > 100))
        ) {
          setErrorMessage('-100 ~ 100 사이의 값을 입력해주세요.');
          return;
        }

        onChange('accumulatedProfitLossRateRangeStart', startValue);
        onChange('accumulatedProfitLossRateRangeEnd', endValue);
        setErrorMessage('');
      };

      return (
        <div css={rangeStyle}>
          <div className='wrapper'>
            <div className='input-area'>
              <TextInput
                type='text'
                value={rangeStart}
                placeholder='-100'
                width={118}
                handleChange={handleRangeChange('start')}
                handleKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
              ~
              <TextInput
                type='text'
                value={rangeEnd}
                placeholder='100'
                width={118}
                handleChange={handleRangeChange('end')}
                handleKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
              %
            </div>
            <IconButton
              IconComponent={SearchIcon}
              iconSize='sm'
              color='primary'
              handleClick={handleSubmit}
            />
          </div>
          {errorMessage && <span className='error-msg'>{errorMessage}</span>}
        </div>
      );
    }

    default:
      return null;
  }
};

const StrategyFilter = ({
  tabIndex,
  currentFilters,
  onFilterChange,
}: StrategyFilterProps) => {
  const { data: methodAndStockData } = useGetMethodAndStock();
  const [filters, setFilters] = useState(TAB_FILTERS);

  useEffect(() => {
    if (!methodAndStockData) return;

    const { methodList, stockList } = methodAndStockData;

    if (!methodList?.length || !stockList?.length) {
      return;
    }

    setFilters((prev) => {
      const updatedFilters = prev[0].map((filter) => {
        if (filter.id === 'methods') {
          return {
            ...filter,
            options: methodList.map(
              (method: any): { value: string; label: string } => ({
                value: method.name,
                label: method.name,
              })
            ),
          };
        }
        if (filter.id === 'stockNames') {
          return {
            ...filter,
            options: stockList.map(
              (stock: any): { value: string; label: string } => ({
                value: stock.name,
                label: stock.name,
              })
            ),
          };
        }
        return filter;
      });

      return {
        ...prev,
        0: updatedFilters,
      };
    });
  }, [methodAndStockData]);

  return (
    <div css={filterContentStyle}>
      {filters[tabIndex]?.map((filter) => (
        <div className='filter' key={filter.id}>
          <label className='filter-label'>{filter.label}</label>
          <FilterInput
            filter={filter}
            currentValue={currentFilters[filter.id]}
            onChange={onFilterChange}
          />
        </div>
      ))}
    </div>
  );
};

export default StrategyFilter;

const filterContentStyle = css`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  .filter {
    min-width: 200px;
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
    padding: 12px 0;

    &::after {
      content: '';
      position: absolute;
      height: 1px;
      width: 100%;
      background-color: ${COLOR.GRAY};
      bottom: 0;
      left: 0;
    }

    &:nth-last-of-type(1) {
      gap: 36px;
      padding: 14px 0;

      &::after {
        content: '';
        position: absolute;
        height: 1px;
        width: 100%;
        background-color: transparent;
        bottom: 0;
        left: 0;
      }
    }

    .filter-label {
      display: block;
      min-width: 80px;
      font-weight: ${FONT_WEIGHT.BOLD};
      color: ${COLOR.BLACK};
    }
  }
`;

const radioStyle = css`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    font-size: ${FONT_SIZE.TEXT_LG};

    :hover {
      color: ${COLOR.PRIMARY};
    }
  }
`;

const rangeStyle = css`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .wrapper {
    display: flex;
    align-items: center;
    gap: 16px;

    .input-area {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .error-msg {
    color: ${COLOR.ERROR_RED};
    font-size: ${FONT_SIZE.TEXT_SM};
  }
`;
