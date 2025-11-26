import time
import random
import string
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# --- Variáveis de Configuração ---
WAIT_TIME = 10 
DELAY_STEP = 2 # Atraso de 2 segundos após cada etapa
FINAL_DELAY = 5 # Atraso final de 5 segundos

def random_string(length=10):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def random_cnpj():
    """Gera um CNPJ fictício no formato XX.XXX.XXX/0001-XX"""
    return f"{random.randint(10, 99)}.{random.randint(100, 999)}.{random.randint(100, 999)}/0001-{random.randint(10, 99)}"

def test_register_company():
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
    wait = WebDriverWait(driver, WAIT_TIME)

    test_email = f"teste.empresa.{random_string(5)}@example.com"
    test_password = "senha1234"
    
    try:
        # 1. Abra a página de cadastro
        driver.get("http://localhost:3000/cadastro")
        print("Página de cadastro aberta.")
        time.sleep(DELAY_STEP)

        # 2. Clique na aba Empresa
        empresa_tab = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Empresa')]")),
            message="A aba 'Empresa' não foi encontrada."
        )
        empresa_tab.click()
        print("Aba Empresa selecionada.")
        time.sleep(DELAY_STEP)

        # Nome da Empresa
        wait.until(
            EC.visibility_of_element_located((By.ID, "company-name")),
            message="Campo Nome do Representante ('company-name') não encontrado."
        ).send_keys(f"Representante Teste {random_string(3)}")
        time.sleep(DELAY_STEP)

        # CNPJ 
        driver.find_element(By.ID, "company-cnpj").send_keys(random_cnpj())
        time.sleep(DELAY_STEP)

        # E-mail 
        driver.find_element(By.ID, "company-email").send_keys(test_email)
        time.sleep(DELAY_STEP)
        
        # Razão Social 
        driver.find_element(By.ID, "company-razao-social").send_keys(f"Razão Social LTDA {random_string(4)}")
        time.sleep(DELAY_STEP)
        
        # Nome Fantasia
        driver.find_element(By.ID, "company-nome-social").send_keys(f"Nome Fantasia {random_string(4)}")
        time.sleep(DELAY_STEP)

        # Senha - ID 'company-password'
        driver.find_element(By.ID, "company-password").send_keys(test_password)
        time.sleep(DELAY_STEP)
        
        # Digita confirmação de senha
        driver.find_element(By.ID, "company-confirm-password").send_keys(test_password)
        time.sleep(DELAY_STEP)

        # Clicar no checkbox de Termos 
        driver.find_element(By.ID, "company-terms").click()
        time.sleep(DELAY_STEP)
        
        # Clicar no botão final de submissão 
        final_submit_button = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Criar conta da empresa')]")),
            message="Botão de submissão final ('Criar conta da empresa') não encontrado."
        )
        final_submit_button.click()
        time.sleep(DELAY_STEP)

        # 12. Verifique o redirecionamento
        wait.until(
            EC.url_contains("dashboard"),
            message="A empresa não foi redirecionada para o dashboard após o cadastro/login."
        )
        
        print(f"Teste de cadastro de empresa: SUCESSO. Empresa {test_email} cadastrada e logada.")

    finally:
        time.sleep(FINAL_DELAY) 
        driver.quit()

if __name__ == "__main__":
    test_register_company()