import json
import boto3
from datetime import datetime
from fpdf import FPDF
import os

s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
CONTRACTS_BUCKET = os.environ.get('CONTRACTS_BUCKET', '')
AFFILIATES_TABLE = os.environ.get('AFFILIATES_TABLE', '')

class ContractPDF(FPDF):
    def header(self):
        # Logo/En-tête EOLIA
        self.set_font('Arial', 'B', 20)
        self.set_text_color(6, 95, 70)  # Couleur EOLIA #065f46
        self.cell(0, 15, 'EOLIA', 0, 1, 'C')
        self.set_font('Arial', '', 10)
        self.set_text_color(0, 0, 0)
        self.cell(0, 5, 'Programme Ambassadeur B2B - Eoliennes Tulipe', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_contract(event, context):
    """
    Genere un contrat PDF pour un ambassadeur B2B EOLIA
    """
    try:
        # Parser les donnees de l'evenement
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event
        
        # Donnees requises
        affiliate_id = body.get('affiliateId')
        company_name = body.get('companyName')
        siret = body.get('siret')
        email = body.get('email')
        
        if not all([affiliate_id, company_name, siret, email]):
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Missing required fields',
                    'message': 'affiliateId, companyName, siret, and email are required'
                })
            }
        
        # Recuperer les donnees completes de l'affiliate depuis DynamoDB
        table = dynamodb.Table(AFFILIATES_TABLE)
        response = table.get_item(Key={'affiliateId': affiliate_id})
        affiliate = response.get('Item', {})
        
        code = affiliate.get('code', 'N/A')
        phone = affiliate.get('professionalPhone', 'Non renseigne')
        signed_at = datetime.now().isoformat()
        
        # Creer le PDF
        pdf = ContractPDF()
        pdf.add_page()
        
        # Titre du contrat
        pdf.set_font('Arial', 'B', 16)
        pdf.cell(0, 10, 'CONTRAT D\'APPORTEUR D\'AFFAIRES', 0, 1, 'C')
        pdf.ln(5)
        
        # Date
        pdf.set_font('Arial', '', 10)
        date_str = datetime.now().strftime('%d/%m/%Y a %H:%M')
        pdf.cell(0, 5, f'Date de signature : {date_str}', 0, 1, 'R')
        pdf.ln(10)
        
        # Section 1: Informations de l'entreprise
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 8, '1. INFORMATIONS DE L\'ENTREPRISE', 0, 1)
        pdf.set_font('Arial', '', 10)
        pdf.ln(2)
        
        pdf.cell(50, 6, 'Raison sociale :', 0, 0)
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(0, 6, company_name, 0, 1)
        
        pdf.set_font('Arial', '', 10)
        pdf.cell(50, 6, 'SIRET :', 0, 0)
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(0, 6, siret, 0, 1)
        
        pdf.set_font('Arial', '', 10)
        pdf.cell(50, 6, 'Email :', 0, 0)
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(0, 6, email, 0, 1)
        
        pdf.set_font('Arial', '', 10)
        pdf.cell(50, 6, 'Telephone :', 0, 0)
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(0, 6, phone, 0, 1)
        
        pdf.set_font('Arial', '', 10)
        pdf.cell(50, 6, 'Code ambassadeur :', 0, 0)
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(0, 6, code, 0, 1)
        pdf.ln(10)
        
        # Section 2: Objet du contrat
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 8, '2. OBJET DU CONTRAT', 0, 1)
        pdf.set_font('Arial', '', 10)
        pdf.ln(2)
        
        pdf.multi_cell(0, 5, 
            "Le present contrat a pour objet de definir les conditions dans lesquelles "
            "l'Apporteur d'Affaires (ci-apres \"l'Ambassadeur\") s'engage a recommander "
            "les eoliennes verticales Tulipe et services EOLIA a des clients potentiels "
            "(ci-apres \"les Filleuls\"), en contrepartie d'une commission sur les ventes realisees."
        )
        pdf.ln(5)
        
        # Section 3: Produits concernes
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 8, '3. PRODUITS CONCERNES', 0, 1)
        pdf.set_font('Arial', '', 10)
        pdf.ln(2)
        
        pdf.multi_cell(0, 5,
            "Le present contrat couvre l'ensemble des produits et services commercialises par EOLIA, "
            "notamment :\n"
            "- Eoliennes verticales Tulipe (1, 2, 3, 5 et 10 kWc)\n"
            "- Onduleurs et systemes de stockage (IMEON, Fronius)\n"
            "- Forfaits d'installation cle en main\n"
            "- Accessoires et pieces detachees"
        )
        pdf.ln(5)
        
        # Section 4: Grille de commissions
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 8, '4. GRILLE DE COMMISSIONS', 0, 1)
        pdf.set_font('Arial', '', 10)
        pdf.ln(2)
        
        pdf.multi_cell(0, 5,
            "Les commissions sont calculees en pourcentage du chiffre d'affaires (CA) genere "
            "par les Filleuls et evoluent selon des paliers cumulatifs :"
        )
        pdf.ln(3)
        
        # Tableau des commissions
        pdf.set_font('Arial', 'B', 10)
        pdf.set_fill_color(6, 95, 70)  # Couleur EOLIA
        pdf.set_text_color(255, 255, 255)
        pdf.cell(90, 8, 'Chiffre d\'affaires cumule', 1, 0, 'C', True)
        pdf.cell(90, 8, 'Taux de commission', 1, 1, 'C', True)
        
        pdf.set_font('Arial', '', 10)
        pdf.set_text_color(0, 0, 0)
        
        tiers = [
            ('De 0 EUR a 9 999 EUR', '5%'),
            ('De 10 000 EUR a 49 999 EUR', '7,5%'),
            ('De 50 000 EUR a 99 999 EUR', '10%'),
            ('100 000 EUR et plus', '12,5%')
        ]
        
        for i, (ca_range, rate) in enumerate(tiers):
            fill = i % 2 == 0
            pdf.set_fill_color(245, 245, 245)
            pdf.cell(90, 7, ca_range, 1, 0, 'L', fill)
            pdf.cell(90, 7, rate, 1, 1, 'C', fill)
        
        pdf.ln(5)
        pdf.set_font('Arial', 'I', 9)
        pdf.multi_cell(0, 5,
            "Note : Le taux de commission applicable est determine par le CA cumule total genere "
            "par l'Ambassadeur depuis le debut de sa collaboration avec EOLIA."
        )
        pdf.ln(5)
        
        # Section 5: Conditions generales
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 8, '5. CONDITIONS GENERALES', 0, 1)
        pdf.set_font('Arial', '', 10)
        pdf.ln(2)
        
        conditions = [
            "5.1. L'Ambassadeur s'engage a promouvoir les produits EOLIA de maniere loyale et conforme a l'image de la marque.",
            "5.2. Les commissions sont calculees sur le montant HT des commandes validees et payees.",
            "5.3. Les commissions sont versees mensuellement, sous reserve d'un montant minimum de 100 EUR.",
            "5.4. L'Ambassadeur doit obtenir le consentement explicite des Filleuls avant de transmettre leurs coordonnees.",
            "5.5. EOLIA se reserve le droit de refuser ou d'annuler une commission en cas de fraude ou de non-respect des conditions.",
            "5.6. Le present contrat est conclu pour une duree indeterminee et peut etre resilie par l'une ou l'autre des parties avec un preavis de 30 jours."
        ]
        
        for condition in conditions:
            pdf.multi_cell(0, 5, condition)
            pdf.ln(2)
        
        pdf.ln(5)
        
        # Section 6: Signature electronique
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 8, '6. SIGNATURE ELECTRONIQUE', 0, 1)
        pdf.set_font('Arial', '', 10)
        pdf.ln(2)
        
        pdf.multi_cell(0, 5,
            "En validant ce contrat, l'Ambassadeur reconnait avoir pris connaissance de l'ensemble "
            "des conditions et s'engage a les respecter. La signature electronique a la meme valeur "
            "juridique qu'une signature manuscrite."
        )
        pdf.ln(5)
        
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(0, 6, 'Informations de signature :', 0, 1)
        pdf.set_font('Arial', '', 9)
        pdf.cell(0, 5, f'Date et heure : {date_str}', 0, 1)
        pdf.cell(0, 5, f'Identifiant ambassadeur : {affiliate_id}', 0, 1)
        
        # Generer le PDF en memoire
        pdf_output = pdf.output()
        
        # Upload vers S3
        s3_key = f'affiliation/contracts/{affiliate_id}.pdf'
        s3_client.put_object(
            Bucket=CONTRACTS_BUCKET,
            Key=s3_key,
            Body=pdf_output,
            ContentType='application/pdf',
            ContentDisposition='inline'
        )
        
        # Generer l'URL du contrat
        contract_url = f'https://{CONTRACTS_BUCKET}.s3.amazonaws.com/{s3_key}'
        
        # Mettre a jour l'affiliate avec l'URL du contrat
        table.update_item(
            Key={'affiliateId': affiliate_id},
            UpdateExpression='SET contractUrl = :url, contractSignedAt = :signed, updatedAt = :now',
            ExpressionAttributeValues={
                ':url': contract_url,
                ':signed': int(datetime.now().timestamp() * 1000),
                ':now': int(datetime.now().timestamp() * 1000)
            }
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'contractUrl': contract_url,
                's3Key': s3_key,
                'affiliateId': affiliate_id
            })
        }
        
    except Exception as e:
        print(f'Error generating contract: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Failed to generate contract',
                'message': str(e)
            })
        }

def handler(event, context):
    """Lambda handler"""
    return generate_contract(event, context)
