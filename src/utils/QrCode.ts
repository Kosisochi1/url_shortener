import axios from "axios";

  export async function qrCode  (reqQr: any) {
	const reqBody = reqQr;
	const data = {
		frame_name: 'no-frame',
		qr_code_text: reqBody,
		image_format: 'SVG',
		qr_code_logo: 'scan-me-square',
	};

	const options = {
		method: 'POST',
		url: 'https://api.qr-code-generator.com/v1/create?access-token=k11u-0kcrtKLiXkpPEZnnNUH9RTpYxOOwxf8_zL52Jx2LzVjxvOaiD2lXyc69TMf',

		headers: {
			'content-type': 'application/json',
		},
		data: data,
	};

	try {
		const response = await axios.request(options);
		// console.log(response.data);
			return response.data
		
	} catch (error) {
		console.error(error);
	}
};