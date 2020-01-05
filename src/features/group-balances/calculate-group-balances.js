const CURRENCY_USD = 'USD';
const CURRENCY_BYN = 'BYN';
const CURRENCY_PLN = 'PLN';
const CURRENCY_EUR = 'EUR';

const exchangeRates = {
  [CURRENCY_BYN]: 2.13,
  [CURRENCY_PLN]: 3.71,
  [CURRENCY_EUR]: 1.132,
};

const arrayWithoutIndex = (array, indexToExclude) => array
  .filter((value, index) => index !== indexToExclude);

const getExchangeRate = (from) => exchangeRates[from];

const parseDebtApiObject = (debtApiObject) => ({
  ...debtApiObject,
  amount: Number.parseInt(parseFloat(debtApiObject.amount) * 100, 10),
});

const convertDebt = (debt) => ({
  ...debt,
  amount: Number.parseInt(debt.amount / getExchangeRate(debt.currency_code), 10),
  currency_code: CURRENCY_USD,
});

const needToConvert = (debt) => debt.currency_code !== CURRENCY_USD;

const convertDebtIfNeeded = (debt) => {
  if (!needToConvert(debt)) {
    return debt;
  }

  return convertDebt(debt);
};

const sumDebtsAmounts = (debts) => debts.reduce((sum, debt) => debt.amount + sum, 0);

const sumDebtsInOneCurrency = (debts, currentDebt) => {
  const { from, to } = currentDebt;

  const existingDebtBetweenMembersIndex = debts
    .findIndex((debt) => debt.from === from && debt.to === to);
  const debtBetweenMembersExists = existingDebtBetweenMembersIndex !== -1;
  if (!debtBetweenMembersExists) {
    return debts.concat(currentDebt);
  }

  const existingDebtBetweenMembers = debts[existingDebtBetweenMembersIndex];
  return [
    ...arrayWithoutIndex(debts, existingDebtBetweenMembersIndex),
    {
      ...currentDebt,
      amount: sumDebtsAmounts([currentDebt, existingDebtBetweenMembers]),
    },
  ];
};

const getAllDebtsFromMember = (debts, memberId) => debts.filter((debt) => debt.from === memberId);

const getAllDebtsToMember = (debts, memberId) => debts.filter((debt) => debt.to === memberId);

const getMemberFullName = (member) => [member.first_name, member.last_name].filter((v) => !!v).join(' ');

const calculateMembersBalance = (member, debtsFromMember, debtsToMember) => ({
  fullName: getMemberFullName(member),
  debtsFromMember,
  debtsToMember,
  net: sumDebtsAmounts(debtsToMember) - sumDebtsAmounts(debtsFromMember),
});

export default (group) => {
  const { members, simplified_debts: simplifiedDebts } = group;

  const convertedDebts = simplifiedDebts
    .map(parseDebtApiObject)
    .map(convertDebtIfNeeded)
    .reduce(sumDebtsInOneCurrency, []);

  return members.map((member) => calculateMembersBalance(
    member,
    getAllDebtsFromMember(convertedDebts, member.id),
    getAllDebtsToMember(convertedDebts, member.id),
  ));
};
