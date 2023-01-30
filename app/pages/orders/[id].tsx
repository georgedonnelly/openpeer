import { Loading, Steps } from 'components';
import { Completed, Payment, Release, Summary } from 'components/Buy';
import { UIOrder } from 'components/Buy/Buy.types';
import WrongNetwork from 'components/WrongNetwork';
import { useConnection } from 'hooks';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

const PAYMENT_METHOD_STEP = 2;
const RELEASE_STEP = 3;
const COMPLETED_STEP = 4;

const OrderPage = ({ id }: { id: number }) => {
	const [order, setOrder] = useState<UIOrder>();
	const { wrongNetwork, status } = useConnection();

	useEffect(() => {
		fetch(`/api/orders/${id}`)
			.then((res) => res.json())
			.then((data) => {
				// setOrder({ ...order, ...{ list: data, listId: data.id } });
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	// useEffect(() => {
	// 	setOrder({ ...order, ...{ price } });
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [price]);
	if (wrongNetwork) return <WrongNetwork />;
	if (status === 'loading' || !order) return <Loading />;

	const step = 2;
	return (
		<div className="pt-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-8">
				<h1 className="text-2xl font-semibold text-gray-900">Buy</h1>
			</div>
			<div className="w-full flex flex-row px-4 sm:px-6 md:px-8 mb-16">
				<div className="w-full lg:w-2/4">
					<Steps currentStep={step} />
					{step === PAYMENT_METHOD_STEP && <Payment order={order} updateOrder={setOrder} />}
					{step === RELEASE_STEP && <Release order={order} updateOrder={setOrder} />}
					{step === COMPLETED_STEP && (
						<div>
							<Completed order={order} updateOrder={setOrder} />
						</div>
					)}
				</div>
				{!!order.list && <Summary order={order} />}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => {
	// Pass data to the page via props
	return { props: { id: String(context.params?.id) } };
};
export default OrderPage;