import React, { useState, useEffect } from 'react';
import Group from './Group';
import Group2 from './Group2';
import { getGroup } from '../Api/group.api';

export default function GroupPage() {
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [expenses, setExpenses] = useState([])
  const [transactions, setTransactions] = useState([])
  const [balances, setBalances] = useState({})
  const [loading, setLoading] = useState(true)

  const { groupId } = useParams()

  const fetchGroupData = async () => {
        try {
          const groupData = await getGroup(groupId);
          setBalances(groupData.data.balances);
          setTransactions(groupData.data.transactions);
          setExpenses(groupData.data.totalSpent)
        } catch (error) {
          console.log("errorrr in fetching group , i.e", error);
        }
        finally {
          setLoading(false);
        }
    }

  useEffect(() => {
    const handleResize = async () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    // Set initial size
    fetchGroupData();
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop ? <Group2
    onFetchGroupData={fetchGroupData}
    groupId={groupId}
    expenses={expenses}
    transactions={transactions}
    balances={balances}
    loading={loading}
  /> :
    <Group
      onFetchGroupData={fetchGroupData}
      groupId={groupId}
      expenses={expenses}
      transactions={transactions}
      balances={balances}
      loading={loading}
    />;
}
