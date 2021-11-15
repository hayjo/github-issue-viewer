import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useStoredList from '../src/hooks/useStoredList';

const mockData = { id: 'string', name: 'name' };
const LIST_LIMIT = 2;

describe('Test for `useStoredList`', () => {
  beforeEach(() => {
    jest
      .spyOn(AsyncStorage, 'getItem')
      .mockImplementation(() => JSON.stringify([]));
    jest.spyOn(AsyncStorage, 'setItem').mockImplementation(() => {});
  });

  afterEach(() => {
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();
  });

  it('should initialize correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useStoredList({ key: 'repoList', limit: LIST_LIMIT }),
    );

    await waitForNextUpdate();

    expect(AsyncStorage.getItem).toHaveBeenCalled();

    const { list, updateList, hasExceedLimit, confirmLimitNotice, error } =
      result.current;

    expect(list).toEqual([]);
    expect(typeof updateList).toEqual('function');
    expect(hasExceedLimit).toEqual(false);
    expect(typeof confirmLimitNotice).toEqual('function');
    expect(error).toEqual('');
  });

  it('should correctly store data when updateList is called', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useStoredList({ key: 'repoList', limit: LIST_LIMIT }),
    );

    await waitForNextUpdate();

    const { updateList } = result.current;

    act(() => {
      updateList(mockData);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalled();
    expect(AsyncStorage.setItem).toBeCalledWith(
      'repoList',
      JSON.stringify([mockData]),
    );
    expect(result.current.list.length).toEqual(1);
    expect(result.current.list).toEqual([mockData]);
  });

  it('should handle when limit is exceed', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useStoredList({ key: 'repoList', limit: LIST_LIMIT }),
    );

    await waitForNextUpdate();

    const { updateList } = result.current;

    act(() => {
      for (let i = 0; i < LIST_LIMIT + 1; i++) {
        updateList({ id: i });
      }
    });

    expect(result.current.hasExceedLimit).toEqual(true);
    expect(result.current.list.length).toEqual(LIST_LIMIT);
  });
});
