import alertBalances from './show-balances.js';

const renderBalancesButton = (groupId) => {
  const relationshipBalances = document.getElementById('relationship_balances');
  const fullGroup = relationshipBalances.getElementsByClassName('full_group')[0];

  const button = document.createElement('button');
  button.innerText = 'Calculate balances';
  button.onclick = () => alertBalances(groupId);

  relationshipBalances.insertBefore(button, fullGroup);
};

export default ([, groupId]) => setTimeout(() => renderBalancesButton(parseInt(groupId, 10)), 1000);
