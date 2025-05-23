import { cn, getMappedKey, sortByReference } from '../utils';

const mockMap = {
  supertree: '수퍼트리',
  'd.dive': '디다이브',
  ellen: '엘렌',
} as const;

type MockKey = keyof typeof mockMap;

describe('cn 함수 (className 유틸리티)', () => {
  it('문자열 클래스들을 공백으로 잘 병합한다', () => {
    expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold');
  });

  it('중복된 Tailwind 클래스는 가장 마지막 것이 적용된다', () => {
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('falsy 값은 무시된다', () => {
    expect(cn('text-sm', null, undefined, false, '', 'font-bold')).toBe('text-sm font-bold');
  });

  it('객체 형태의 조건부 클래스도 올바르게 병합된다', () => {
    expect(cn({ 'text-sm': true, 'text-lg': false }, 'font-medium')).toBe('text-sm font-medium');
  });

  it('tailwind-merge에 의해 충돌 클래스는 병합된다 (예: px-2 + px-4 → px-4)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});

describe('getMappedKey 함수', () => {
  it('value에 해당하는 key를 정확히 반환한다', () => {
    expect(getMappedKey<MockKey>(mockMap, '디다이브')).toBe('d.dive');
    expect(getMappedKey<MockKey>(mockMap, '수퍼트리')).toBe('supertree');
    expect(getMappedKey<MockKey>(mockMap, '엘렌')).toBe('ellen');
  });

  it('일치하는 value가 없으면 undefined를 반환한다', () => {
    expect(getMappedKey<MockKey>(mockMap, '없는 값')).toBeUndefined();
  });

  it('빈 문자열 입력 시 undefined를 반환한다', () => {
    expect(getMappedKey<MockKey>(mockMap, '')).toBeUndefined();
  });
});

describe('sortByReference 함수', () => {
  const reference = ['supertree', 'd.dive', 'ellen'] as const;
  type Ref = (typeof reference)[number];

  const isInReference = (value: string): value is Ref => reference.includes(value as Ref);

  it('target 배열을 reference 순서대로 정렬한다', () => {
    const target = ['ellen', 'supertree'] as const;
    const result = sortByReference([...target], [...reference]);
    expect(result).toEqual(['supertree', 'ellen']);
  });

  it('target 배열이 빈 배열이면 빈 배열을 반환한다', () => {
    const result = sortByReference([], [...reference]);
    expect(result).toEqual([]);
  });

  it('target이 reference에 없는 값을 포함해도 무시된다', () => {
    const target = ['unknown', 'supertree'];
    const filtered = target.filter(isInReference);
    const result = sortByReference(filtered, [...reference]);
    expect(result).toEqual(['supertree']);
  });
});
