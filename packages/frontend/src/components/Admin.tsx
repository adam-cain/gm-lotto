// import { useAccount } from 'wagmi';
// import Card from './Card';
// import { useState } from 'react';
// import { useWriteContract, useReadContract } from 'wagmi';
// import 

// export default function Admin() {
//     const { address } = useAccount();

//     if (address !== '0x2048E880Cb351E19BB11836b8B71cC60bd043E7B') {
//         return null;
//     }

//     const { writeContract: endRound } = useWriteContract({
//         address: '0x2048E880Cb351E19BB11836b8B71cC60bd043E7B',
//         abi: abi,
//         functionName: 'endRound',
//     });

//     const [winAmount, setWinAmount] = useState<string>('');

//     const endRound = () => {
//         const amount = parseFloat(winAmount);
//         if (isNaN(amount) || amount <= 0) {
//             alert('Win amount must be greater than 0');
//             return;
//         }

//         const confirm = window.confirm(`Are you sure you want to end the round and pay ${amount} eth?`);
//         if (confirm) {
//             console.log('End round');
//         }


//     }

//     const pauseLottery = () => {
//         const confirm = window.confirm('Are you sure you want to pause the lottery?');
//         if (confirm) {
//             console.log('Pause lottery');
//         }
//     }

//     const playLottery = () => {
//         const confirm = window.confirm('Are you sure you want to play the lottery?');
//         if (confirm) {
//             console.log('Play lottery');
//         }
//     }

//     const withdraw = () => {
//         const confirm = window.confirm('Are you sure you want to withdraw the contract balance?');
//         if (confirm) {
//             console.log('Withdraw');
//         }
//     }


//     return (
//         <Card className="mb-8 space-y-6">
//             <h1 className="text-2xl font-bold">Admin Panel</h1>

//             <div className="space-y-2">
//                 <h2 className="text-lg font-bold">End round</h2>
//                 <p className="text-sm text-gray-500">
//                     End the current round, set and pay into the contract the win amount.
//                 </p>
//                 <div className="flex space-x-2 items-end">
//                     <div className="flex-1">
//                         <label htmlFor="winAmount" className="block text-sm font-medium text-gray-700 mb-1">
//                             Win amount (ETH)
//                         </label>
//                         <input
//                             id="winAmount"
//                             name="winAmount"
//                             type="number"
//                             min="0"
//                             inputMode="decimal"
//                             value={winAmount}
//                             onChange={(e) => setWinAmount(e.target.value)}
//                             placeholder="0.01"
//                             required
//                             className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-gray-200"
//                         />
//                     </div>
//                     <button onClick={endRound} className="whitespace-nowrap py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
//                         End round
//                     </button>
//                 </div>
//             </div>

//             <div className="space-y-2">
//                 <h2 className="text-lg font-bold">Emergency</h2>
//                 <p className="text-sm text-gray-500">
//                     For emergencies: pause and play the lottery. Withdraw the contract balance if needed.
//                 </p>
//                 <div className="flex space-x-2">
//                     <button className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Pause</button>
//                     <button className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition">Play</button>
//                     <button className="flex-1 py-2 px-4 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition">Withdraw</button>
//                 </div>
//             </div>

//         </Card>
//     );
// }