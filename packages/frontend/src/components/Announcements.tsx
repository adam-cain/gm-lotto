interface Announcement {
  id: number;
  title: string;
  date: string;
  content: string;
}

interface Winner {
  id: number;
  address: string;
  amount: string;
  date: string;
}

const winners: Winner[] = [
  {
    id: 1,
    address: "0x1234567890abcdef1234567890abcdef12345678",
    amount: "1.5 ETH",
    date: "2025-03-15"
  },
  {
    id: 2,
    address: "0x2345678901abcdef2345678901abcdef23456789",
    amount: "0.8 ETH",
    date: "2025-03-14"
  },
  {
    id: 3,
    address: "0x3456789012abcdef3456789012abcdef34567890",
    amount: "2.2 ETH",
    date: "2025-03-13"
  },
  {
    id: 4,
    address: "0x4567890123abcdef4567890123abcdef45678901",
    amount: "0.5 ETH",
    date: "2025-03-12"
  },
  {
    id: 5,
    address: "0x5678901234abcdef5678901234abcdef56789012",
    amount: "1.0 ETH",
    date: "2025-03-11"
  },
];

const Announcements: React.FC = () => {
  return (
    <div className="bg-white  rounded-xl shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4">Recent Winners</h3>

      <div className="space-y-4">
        {winners.map((winner) => (
          <div key={winner.id} className="border-b border-gray-200  pb-3 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold">{winner.address.substring(0, 6)}...{winner.address.substring(38)}</h4>
              <span className="text-sm text-green-500">+{winner.amount}</span>
            </div>
            <p className="text-xs text-gray-600 ">{winner.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
