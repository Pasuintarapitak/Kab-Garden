import Image from "next/image";
import Link from "next/link";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, name, price, image }: ProductProps) {
  return (
    <Link href={`/products/${id}`} className="group block">
     <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-sm mb-4">
    <Image
        src={image}
        alt={name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
    </div>
    <h3 className="text-sm font-medium text-gray-900 group-hover:underline underline-offset-4">
        {name}
    </h3>
    <p className="mt-1 text-sm text-gray-500 font-semibold">
        ฿{price.toLocaleString()}
    </p>
    </Link>
  );
}