import { getMainData } from '../../api-client.js';
import calculateGroupBalances from './calculate-group-balances.js';

const getMemberFullName = (member) => [member.first_name, member.last_name].filter((v) => !!v).join(' ');

const createBalanceDescriptionFormatter = (members) => {
  const getMemberFullNameById = (memberId) => getMemberFullName(
    members.find((m) => m.id === memberId),
  );
  const getDebtFromMemberDescription = (debt) => `  they owe ${debt.amount / 100} to ${getMemberFullNameById(debt.to)}`;
  const getDebtToMemberDescription = (debt) => `  they are owed ${debt.amount / 100} by ${getMemberFullNameById(debt.from)}`;

  return (balance) => [
    `${balance.fullName}'s balance is ${balance.net / 100} USD`,
    ...balance.debtsFromMember.map(getDebtFromMemberDescription),
    ...balance.debtsToMember.map(getDebtToMemberDescription),
  ].join('\n');
};

export default async (groupId) => {
  const mainData = await getMainData();

  const group = mainData.groups.find((g) => g.id === groupId);
  const groupBalances = calculateGroupBalances(group);

  const formatBalance = createBalanceDescriptionFormatter(group.members);
  const formattedBalances = groupBalances.map(formatBalance).join('\n');

  console.log(formattedBalances);
  alert(formattedBalances);
};
