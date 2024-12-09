import { useQuery, useMutation } from '@tanstack/react-query';
import {
  approveAdminStrategy,
  rejectAdminStrategy,
  getAdminNoticeList,
  GetAdminNoticeListData,
  getAdminNotice,
  GetAdminNoticeData,
  updateAdminNotice,
  deleteAdminNotice,
  updateAdminNoticeStatus,
  createAdminNotice,
  deleteAdminNoticeList,
  getAdminNoticeEdit,
  getInquiryList,
  DeleteInquiryListRequest,
  deleteInquiryList,
  deleteDetailInquiry,
  getAdminInquiryDetail,
  AdminUserData,
  deleteAdminUser,
  getAdminUserList,
  PaginatedResponse,
  updateAdminUserRole,
  UpDateUserRole,
  createAdminMethods,
  createAdminStocks,
  deleteAdminMethods,
  deleteAdminStocks,
  getAdminMethods,
  getAdminStocks,
  MethodsPaginatedResponse,
  MethodsParameterProps,
  StocksPaginatedResponse,
  StocksParameterProps,
  updateAdminMethods,
  updateAdminStocks,
  AdminStrategyDtoProps,
  getAdminStrategyList,
  getAdminMain,
} from '@/api';

export const useApproveAdminStrategy = () =>
  useMutation({
    mutationFn: (approveData: { strategyId: number[] }) =>
      approveAdminStrategy(approveData),
  });

export const useRejectAdminStrategy = () =>
  useMutation({
    mutationFn: (rejectData: { strategyId: number; rejectReason: string }) =>
      rejectAdminStrategy(rejectData),
  });

export const useGetAdminStocks = (
  params: StocksParameterProps,
  enabled: boolean
) =>
  useQuery<StocksPaginatedResponse, Error>({
    queryKey: ['adminStocks', params],
    queryFn: () => getAdminStocks(params),
    enabled: !!enabled,
  });

export const useCreateAdminStocks = () =>
  useMutation({
    mutationFn: createAdminStocks,
  });

export const useDeleteAdminStocks = () =>
  useMutation({
    mutationFn: deleteAdminStocks,
  });

export const useUpdateAdminStocks = () =>
  useMutation({
    mutationFn: updateAdminStocks,
  });

export const useGetAdminMethods = (
  params: MethodsParameterProps,
  enabled: boolean
) =>
  useQuery<MethodsPaginatedResponse, Error>({
    queryKey: ['adminMethods', params],
    queryFn: () => getAdminMethods(params),
    enabled: !!enabled,
  });

export const useCreateAdminMethods = () =>
  useMutation({
    mutationFn: createAdminMethods,
  });

export const useDeleteAdminMethods = () =>
  useMutation({
    mutationFn: deleteAdminMethods,
  });

export const useUpdateAdminMethods = () =>
  useMutation({
    mutationFn: updateAdminMethods,
  });

// 공지사항 목록 조회 API
export const useGetAdminNoticeList = (params: GetAdminNoticeListData) =>
  useQuery({
    queryKey: ['getAdminNoticeList', params],
    queryFn: () => getAdminNoticeList(params),
  });

// 공지사항 상세 정보 조회 API
export const useGetAdminNotice = (params: GetAdminNoticeData) =>
  useQuery({
    queryKey: ['getAdminNotice', params],
    queryFn: () => getAdminNotice(params),
  });

// 공지사항 수정 API
export const useUpdateAdminNotice = () =>
  useMutation({
    mutationFn: ({
      formData,
      noticeId,
    }: {
      formData: FormData;
      noticeId: string;
    }) => updateAdminNotice(formData, noticeId),
  });

// 공지사항 삭제 API
export const useDeleteAdminNotice = () =>
  useMutation({
    mutationFn: deleteAdminNotice,
  });

// 공지사항 목록에서 개별 공개여부 수정 API
export const useUpdateAdminNoticeStatus = () =>
  useMutation({
    mutationFn: (noticeId: string) => updateAdminNoticeStatus(noticeId),
  });

// 공지사항 등록 API
export const useCreateAdminNotice = () =>
  useMutation({
    mutationFn: (formData: FormData) => createAdminNotice(formData),
  });

// 공지사항 목록 삭제 API
export const useDeleteAdminNoticeList = () =>
  useMutation({
    mutationFn: ({ ids }: { ids: number[] }) => deleteAdminNoticeList(ids),
  });

// 공지사항 수정 화면 조회 API
export const useGetAdminNoticeEdit = (noticeId: string) =>
  useQuery({
    queryKey: ['adminNoticeEdit', noticeId],
    queryFn: () => getAdminNoticeEdit(noticeId),
  });

// 관리자 문의 조회
export const useGetInquiryList = (
  page: number,
  closed: string,
  searchType: string,
  searchText: string
) =>
  useQuery({
    queryKey: ['adminInquiryList', page, closed, searchType, searchText],
    queryFn: () => getInquiryList(page, closed, searchType, searchText),
  });

// 관리자 문의 목록 삭제
export const useDeleteInquiryList = () => {
  const mutation = useMutation<any, Error, DeleteInquiryListRequest>({
    mutationFn: (requestData: DeleteInquiryListRequest) =>
      deleteInquiryList(requestData),
  });

  return mutation;
};

// 관리자 문의 상세조회
export const useGetAdminInquiryDetail = (
  qnaId: number,
  closed: string,
  searchType: string,
  searchText: string
) =>
  useQuery({
    queryKey: ['adminInquiryDetail', qnaId, closed, searchType, searchText],
    queryFn: () => getAdminInquiryDetail(qnaId, closed, searchType, searchText),
  });

// 관리자 문의 특정 삭제 API
export const useDeleteDetailInquiry = () => {
  const mutation = useMutation<any, Error, number>({
    mutationFn: (qnaId: number) => deleteDetailInquiry(qnaId),
  });

  return mutation;
};

// 회원 목록 조회
export const useGetAdminUserList = (params: AdminUserData, enabled: boolean) =>
  useQuery<PaginatedResponse, Error>({
    queryKey: ['adminUserList', params],
    queryFn: () => getAdminUserList(params),
    enabled: !!enabled,
  });

//회원 등급 변경
export const useUpdateAdminUserRole = () =>
  useMutation({
    mutationFn: (params: UpDateUserRole) => updateAdminUserRole(params),
  });

//회원 강제 탈퇴
export const useDeleteAdminUser = () =>
  useMutation({
    mutationFn: async (membersId: number[]) => deleteAdminUser(membersId),
  });

// 관리자 전략목록 조회
export const useGetAdminStrategyList = (params: AdminStrategyDtoProps) =>
  useQuery({
    queryKey: ['adminStrategyList', params],
    queryFn: () => getAdminStrategyList(params),
  });

// 관리자 메인 조회
export const useGetAdminMain = () =>
  useQuery({
    queryKey: ['adminMain'],
    queryFn: () => getAdminMain(),
  });
